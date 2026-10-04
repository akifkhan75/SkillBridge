import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });
      const result = await strategy.validate({ sub: '1', email: 'test', type: 'customer' });
      expect(result).toEqual({ id: '1' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '1' } }));
    });

    it('should throw UnauthorizedException if not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(strategy.validate({ sub: '2', email: 'test', type: 'customer' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
