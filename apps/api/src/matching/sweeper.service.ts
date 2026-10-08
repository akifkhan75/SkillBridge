import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { MatchingService } from './matching.service';

const LOCK_KEY = 4_242_001; // one sweeper at a time across all API instances
const EVERY_MS = 60_000;

/**
 * Background housekeeping, once a minute:
 *  - expire offers past their time limit
 *  - match new requests that were not matched at creation (e.g. a transient failure)
 *  - widen the search once for requests nobody has answered
 * A Postgres advisory lock keeps it to a single runner even with several API instances.
 */
@Injectable()
export class SweeperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SweeperService.name);
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly matching: MatchingService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    if (this.config.get('RUN_BACKGROUND_JOBS') === true || this.config.get('RUN_BACKGROUND_JOBS') === 'true') {
      this.timer = setInterval(() => void this.sweep().catch((e) => this.logger.error(e)), EVERY_MS);
    }
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async sweep(now = new Date()): Promise<{ expired: number; matched: number; widened: number } | null> {
    const [{ locked }] = await this.prisma.$queryRaw<{ locked: boolean }[]>`SELECT pg_try_advisory_lock(${LOCK_KEY}) AS locked`;
    if (!locked) return null;
    try {
      const expired = await this.prisma.offer.updateMany({
        where: { status: 'PENDING', expiresAt: { lte: now } },
        data: { status: 'EXPIRED' },
      });

      const unmatched = await this.prisma.jobRequest.findMany({
        where: { status: 'MATCHES_FOUND', matchRound: 0, createdAt: { lte: new Date(now.getTime() - 30_000) } },
        select: { id: true }, take: 50,
      });
      for (const j of unmatched) await this.matching.matchJob(j.id, 1);

      const after = Number(this.config.get('REMATCH_AFTER_MINUTES') ?? 15);
      const stale = await this.prisma.jobRequest.findMany({
        where: {
          status: 'MATCHES_FOUND', matchRound: 1,
          lastMatchedAt: { lte: new Date(now.getTime() - after * 60_000) },
          offers: { none: { status: 'PENDING' } },
        },
        select: { id: true }, take: 50,
      });
      for (const j of stale) await this.matching.matchJob(j.id, 2);

      return { expired: expired.count, matched: unmatched.length, widened: stale.length };
    } finally {
      await this.prisma.$queryRaw`SELECT pg_advisory_unlock(${LOCK_KEY})`;
    }
  }
}
