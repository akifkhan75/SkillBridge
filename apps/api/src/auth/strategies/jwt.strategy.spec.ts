import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const prisma = { session: { findFirst: jest.fn() } };
  const strategy = new JwtStrategy({ get: () => 'x'.repeat(40) } as any, prisma as any);
  afterEach(() => jest.resetAllMocks());

  it('returns the user plus session id for a live session', async () => {
    prisma.session.findFirst.mockResolvedValue({ user: { id: 'u1', type: 'customer' } });
    await expect(strategy.validate({ sub: 'u1', type: 'customer', sid: 's1' })).resolves.toEqual({
      id: 'u1', type: 'customer', sid: 's1',
    });
    const where = prisma.session.findFirst.mock.calls[0][0].where;
    expect(where).toMatchObject({ id: 's1', userId: 'u1', revokedAt: null, user: { status: 'ACTIVE' } });
  });

  it('rejects a revoked/expired/unknown session', async () => {
    prisma.session.findFirst.mockResolvedValue(null);
    await expect(strategy.validate({ sub: 'u1', type: 'customer', sid: 's1' })).rejects.toThrow(UnauthorizedException);
  });

  it('rejects old tokens that carry no session id', async () => {
    await expect(strategy.validate({ sub: 'u1', type: 'customer' } as any)).rejects.toThrow(UnauthorizedException);
    expect(prisma.session.findFirst).not.toHaveBeenCalled();
  });
});
