import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { SessionService } from './session.service';

const sha = (v: string) => createHash('sha256').update(v).digest('hex');

describe('SessionService', () => {
  const prisma: any = {
    session: { create: jest.fn(), updateMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn() },
  };
  const jwt = { sign: jest.fn().mockReturnValue('access.jwt') };
  const events = { emit: jest.fn(), on: jest.fn() };
  const svc = new SessionService(prisma, jwt as any, { get: () => 30 } as any, events as any);
  beforeEach(() => prisma.session.findMany.mockResolvedValue([]));
  afterEach(() => jest.clearAllMocks());

  const live = (over: any = {}) => ({
    id: 's1',
    refreshTokenHash: sha('secret-1'),
    previousRefreshTokenHash: null,
    revokedAt: null,
    expiresAt: new Date(Date.now() + 86400000),
    lastUsedAt: new Date(Date.now() - 60_000),
    user: { id: 'u1', type: 'customer', status: 'ACTIVE' },
    ...over,
  });

  it('stores only a hash of the refresh token and replaces any earlier session on that device', async () => {
    prisma.session.create.mockResolvedValue({ id: 's9' });
    const pair = await svc.create({ id: 'u1', type: 'customer' }, { deviceId: 'device-12345' });
    expect(prisma.session.findMany.mock.calls[0][0].where).toMatchObject({ userId: 'u1', deviceId: 'device-12345' });
    const stored = prisma.session.create.mock.calls[0][0].data.refreshTokenHash;
    const secret = pair.refreshToken.split('.')[1];
    expect(stored).toBe(sha(secret));
    expect(stored).not.toContain(secret);
    expect(pair.refreshToken.startsWith('s9.')).toBe(true);
  });

  it('rotates: a valid token yields a new pair and remembers the old hash', async () => {
    prisma.session.findUnique.mockResolvedValue(live());
    prisma.session.updateMany.mockResolvedValue({ count: 1 });
    const pair = await svc.refresh('s1.secret-1');
    const data = prisma.session.updateMany.mock.calls[0][0].data;
    expect(data.previousRefreshTokenHash).toBe(sha('secret-1'));
    expect(data.refreshTokenHash).not.toBe(sha('secret-1'));
    expect(pair.refreshToken).not.toBe('s1.secret-1');
  });

  it('rejects garbage, unknown, revoked, expired and wrong-secret tokens', async () => {
    await expect(svc.refresh('nodot')).rejects.toThrow(UnauthorizedException);
    prisma.session.findUnique.mockResolvedValue(null);
    await expect(svc.refresh('s1.x')).rejects.toThrow(UnauthorizedException);
    prisma.session.findUnique.mockResolvedValue(live({ revokedAt: new Date() }));
    await expect(svc.refresh('s1.secret-1')).rejects.toThrow(UnauthorizedException);
    prisma.session.findUnique.mockResolvedValue(live({ expiresAt: new Date(Date.now() - 1) }));
    await expect(svc.refresh('s1.secret-1')).rejects.toThrow(UnauthorizedException);
    prisma.session.findUnique.mockResolvedValue(live());
    await expect(svc.refresh('s1.wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('rejects refresh for a suspended user', async () => {
    prisma.session.findUnique.mockResolvedValue(live({ user: { id: 'u1', type: 'customer', status: 'SUSPENDED' } }));
    await expect(svc.refresh('s1.secret-1')).rejects.toThrow(UnauthorizedException);
  });

  it('reuse of an already-rotated token long after revokes the whole session', async () => {
    prisma.session.findUnique.mockResolvedValue(
      live({ previousRefreshTokenHash: sha('stolen'), lastUsedAt: new Date(Date.now() - 3600_000) }),
    );
    prisma.session.findMany.mockResolvedValue([{ id: 's1' }]);
    prisma.session.updateMany.mockResolvedValue({ count: 1 });
    await expect(svc.refresh('s1.stolen')).rejects.toThrow(UnauthorizedException);
    const revoke = prisma.session.updateMany.mock.calls.at(-1)[0];
    expect(revoke.where.id).toEqual({ in: ['s1'] });
    expect(revoke.data).toMatchObject({ revokedAt: expect.any(Date), pushToken: null });
    // Its open sockets are cut too.
    expect(events.emit).toHaveBeenCalledWith('sessions.revoked', { sessionIds: ['s1'] });
  });

  it('a push token belongs to one session only (moved, not duplicated, when another account signs in on the phone)', async () => {
    await svc.setPushToken('s2', 'u2', 'ExponentPushToken[abc]');
    expect(prisma.session.updateMany.mock.calls[0][0]).toEqual({ where: { pushToken: 'ExponentPushToken[abc]', id: { not: 's2' } }, data: { pushToken: null } });
    expect(prisma.session.updateMany.mock.calls[1][0].where).toEqual({ id: 's2', userId: 'u2', revokedAt: null });
  });

  it('a racing double-refresh moments apart is told to retry instead of being logged out', async () => {
    prisma.session.findUnique.mockResolvedValue(
      live({ previousRefreshTokenHash: sha('secret-1'), refreshTokenHash: sha('secret-2'), lastUsedAt: new Date() }),
    );
    await expect(svc.refresh('s1.secret-1')).rejects.toThrow(ConflictException);
    expect(prisma.session.update).not.toHaveBeenCalled();
  });

  it('only one of two simultaneous rotations wins', async () => {
    prisma.session.findUnique.mockResolvedValue(live());
    prisma.session.updateMany.mockResolvedValue({ count: 0 });
    await expect(svc.refresh('s1.secret-1')).rejects.toThrow(ConflictException);
  });
});
