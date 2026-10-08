import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { DomainEvents } from '../common/events/domain-events';

export interface DeviceInfo {
  deviceId: string;
  deviceName?: string;
  platform?: string;
}

export interface TokenPair {
  token: string;
  refreshToken: string;
}

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');
const sameHash = (a: string, b?: string | null) =>
  !!b && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Sessions + token rotation.
 *  - access token: short-lived JWT {sub,type,sid}
 *  - refresh token: "<sessionId>.<random>" — opaque, stored only as a SHA-256 hash, single use.
 * Presenting an already-rotated refresh token means it leaked or was replayed, so the whole
 * session is revoked (reuse detection).
 */
@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly events: DomainEvents,
  ) {}

  private async revokeWhere(where: Prisma.SessionWhereInput) {
    const rows = await this.prisma.session.findMany({ where: { ...where, revokedAt: null }, select: { id: true } });
    if (!rows.length) return { count: 0 };
    const ids = rows.map((r) => r.id);
    // Revoking also forgets the device's push token: a signed-out phone must not get notifications.
    const res = await this.prisma.session.updateMany({ where: { id: { in: ids }, revokedAt: null }, data: { revokedAt: new Date(), pushToken: null } });
    this.events.emit('sessions.revoked', { sessionIds: ids });
    return res;
  }

  private get refreshDays(): number {
    return Number(this.config.get('REFRESH_TOKEN_DAYS') ?? 30);
  }

  private newSecret(): string {
    return randomBytes(48).toString('base64url');
  }

  private access(userId: string, type: string, sessionId: string): string {
    return this.jwt.sign({ sub: userId, type, sid: sessionId });
  }

  /** One session per (user, device): signing in again on the same device replaces the old one. */
  async create(user: { id: string; type: string }, device: DeviceInfo): Promise<TokenPair> {
    await this.revokeWhere({ userId: user.id, deviceId: device.deviceId });

    const secret = this.newSecret();
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        platform: device.platform,
        refreshTokenHash: sha256(secret),
        expiresAt: new Date(Date.now() + this.refreshDays * 86_400_000),
      },
    });
    return { token: this.access(user.id, user.type, session.id), refreshToken: `${session.id}.${secret}` };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const dot = refreshToken.indexOf('.');
    if (dot < 1) throw new UnauthorizedException('Please sign in again');
    const sessionId = refreshToken.slice(0, dot);
    const hash = sha256(refreshToken.slice(dot + 1));

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: { select: { id: true, type: true, status: true } } },
    });
    if (!session || session.revokedAt || session.expiresAt < new Date() || session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Please sign in again');
    }

    if (sameHash(hash, session.previousRefreshTokenHash)) {
      // Two refreshes racing from the same device land here within moments; a stolen/replayed
      // token lands here much later. Be lenient for the former, strict for the latter.
      if (Date.now() - session.lastUsedAt.getTime() < 10_000) {
        throw new ConflictException({ code: 'REFRESH_IN_PROGRESS', message: 'Session is refreshing, try again' });
      }
      await this.revokeWhere({ id: session.id });
      throw new UnauthorizedException('Please sign in again');
    }
    if (!sameHash(hash, session.refreshTokenHash)) throw new UnauthorizedException('Please sign in again');

    const secret = this.newSecret();
    // Conditional on the hash we just verified: only one concurrent refresh can win.
    const rotated = await this.prisma.session.updateMany({
      where: { id: session.id, refreshTokenHash: session.refreshTokenHash, revokedAt: null },
      data: {
        refreshTokenHash: sha256(secret),
        previousRefreshTokenHash: session.refreshTokenHash,
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + this.refreshDays * 86_400_000),
      },
    });
    if (rotated.count === 0) {
      throw new ConflictException({ code: 'REFRESH_IN_PROGRESS', message: 'Session is refreshing, try again' });
    }
    return {
      token: this.access(session.user.id, session.user.type, session.id),
      refreshToken: `${session.id}.${secret}`,
    };
  }

  revoke(sessionId: string, userId: string) {
    return this.revokeWhere({ id: sessionId, userId });
  }

  revokeAllExcept(userId: string, keepSessionId?: string) {
    return this.revokeWhere({ userId, ...(keepSessionId ? { id: { not: keepSessionId } } : {}) });
  }

  /** Register (or clear) this device's push token. A token belongs to one session only. */
  async setPushToken(sessionId: string, userId: string, token: string | null) {
    if (token) {
      await this.prisma.session.updateMany({ where: { pushToken: token, id: { not: sessionId } }, data: { pushToken: null } });
    }
    await this.prisma.session.updateMany({ where: { id: sessionId, userId, revokedAt: null }, data: { pushToken: token, pushTokenUpdatedAt: new Date() } });
  }

  list(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true, deviceName: true, platform: true, createdAt: true, lastUsedAt: true },
      orderBy: { lastUsedAt: 'desc' },
      take: 20,
    });
  }
}
