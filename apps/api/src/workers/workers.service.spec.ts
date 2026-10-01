import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { PrismaService } from '../database/prisma.service';

describe('WorkersService', () => {
  let service: WorkersService;

  const mockPrisma = {
    worker: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return active workers', async () => {
      const workers = [{ id: 'w1', activationStatus: 'ACTIVE' }];
      mockPrisma.worker.findMany.mockResolvedValue(workers);

      const result = await service.findAll();
      expect(result).toEqual(workers);
      expect(mockPrisma.worker.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ activationStatus: 'ACTIVE' }),
        }),
      );
    });

    it('should filter by skill', async () => {
      mockPrisma.worker.findMany.mockResolvedValue([]);

      await service.findAll({ skill: 'PLUMBING' });

      expect(mockPrisma.worker.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ skills: { has: 'PLUMBING' } }),
        }),
      );
    });

    it('should filter by minimum rating', async () => {
      mockPrisma.worker.findMany.mockResolvedValue([]);

      await service.findAll({ minRating: 4.5 });

      expect(mockPrisma.worker.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ rating: { gte: 4.5 } }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a worker', async () => {
      const worker = { id: 'w1', rating: 4.8 };
      mockPrisma.worker.findUnique.mockResolvedValue(worker);

      const result = await service.findById('w1');
      expect(result).toEqual(worker);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.worker.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMatchingWorkers', () => {
    it('should return online active workers matching job type', async () => {
      const workers = [{ id: 'w1', skills: ['PLUMBING'], isOnline: true }];
      mockPrisma.worker.findMany.mockResolvedValue(workers);

      const result = await service.findMatchingWorkers('PLUMBING', 3);
      expect(result).toEqual(workers);
      expect(mockPrisma.worker.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            activationStatus: 'ACTIVE',
            isOnline: true,
            skills: { has: 'PLUMBING' },
          }),
          take: 3,
        }),
      );
    });
  });
});
