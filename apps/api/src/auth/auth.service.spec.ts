import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    worker: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      type: 'customer' as const,
    };

    it('should create a new customer successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user1',
        name: signupDto.name,
        email: signupDto.email,
        type: signupDto.type,
        profileImageUrl: 'https://picsum.photos/seed/newcustomer/100',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.signup(signupDto);

      expect(result.user).toBeDefined();
      expect(result.token).toBe('mock-jwt-token');
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.worker.create).not.toHaveBeenCalled();
    });

    it('should create a worker profile for worker type', async () => {
      const workerDto = { ...signupDto, type: 'worker' as const };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'worker1',
        name: workerDto.name,
        email: workerDto.email,
        type: 'worker',
        profileImageUrl: 'https://picsum.photos/seed/newworker/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockPrisma.worker.create.mockResolvedValue({});

      const result = await service.signup(workerDto);

      expect(result.user).toBeDefined();
      expect(mockPrisma.worker.create).toHaveBeenCalledWith({
        data: { id: 'worker1', skills: ['GENERAL_HANDYMAN'] },
      });
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: loginDto.email,
        password: hashedPassword,
        type: 'customer',
        name: 'Test',
      });

      const result = await service.login(loginDto);

      expect(result.user).toBeDefined();
      expect(result.token).toBe('mock-jwt-token');
      expect((result.user as any).password).toBeUndefined();
    });

    it('should throw UnauthorizedException for non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('different-password', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        email: loginDto.email,
        password: hashedPassword,
        type: 'customer',
      });

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
