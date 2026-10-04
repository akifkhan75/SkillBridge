import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([{ id: '1', name: 'User 1' }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: '1', name: 'User 1' }]);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', name: 'User 1' });
      const result = await service.findById('1');
      expect(result).toEqual({ id: '1', name: 'User 1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });
  });
});
