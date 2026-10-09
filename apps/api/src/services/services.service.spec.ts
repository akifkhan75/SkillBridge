import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaService } from '../database/prisma.service';

describe('ServicesService', () => {
  let service: ServicesService;

  const mockPrisma = {
    servicePackage: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    subscriptionPlan: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAllPackages', () => {
    it('should return packages', async () => {
      mockPrisma.servicePackage.findMany.mockResolvedValue([{ id: '1' }]);
      const result = await service.findAllPackages();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('findPackageById', () => {
    it('should return package by id', async () => {
      mockPrisma.servicePackage.findUnique.mockResolvedValue({ id: '1' });
      const result = await service.findPackageById('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.servicePackage.findUnique.mockResolvedValue(null);
      await expect(service.findPackageById('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllPlans', () => {
    it('should return plans', async () => {
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue([{ id: '1' }]);
      const result = await service.findAllPlans();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('findPlanById', () => {
    it('should return plan by id', async () => {
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({ id: '1' });
      const result = await service.findPlanById('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(null);
      await expect(service.findPlanById('2')).rejects.toThrow(NotFoundException);
    });
  });
});
