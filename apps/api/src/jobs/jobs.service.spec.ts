import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../database/prisma.service';

describe('JobsService', () => {
  let service: JobsService;

  const mockPrisma = {
    jobRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a job request', async () => {
      const dto = {
        description: 'Fix my leaking faucet',
        jobType: 'PLUMBING',
        location: 'New York',
      };
      const expected = { id: 'jr1', ...dto, status: 'MATCHES_FOUND' };
      mockPrisma.jobRequest.create.mockResolvedValue(expected);

      const result = await service.create('user1', 'Test User', dto as any);
      expect(result).toEqual(expected);
      expect(mockPrisma.jobRequest.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should filter by customerId for customer users', async () => {
      mockPrisma.jobRequest.findMany.mockResolvedValue([]);

      await service.findAll('cust1', 'customer');

      expect(mockPrisma.jobRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ customerId: 'cust1' }),
        }),
      );
    });

    it('should not filter by customerId for worker users', async () => {
      mockPrisma.jobRequest.findMany.mockResolvedValue([]);

      await service.findAll('w1', 'worker');

      expect(mockPrisma.jobRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({ customerId: 'w1' }),
        }),
      );
    });

    it('should apply status filter', async () => {
      mockPrisma.jobRequest.findMany.mockResolvedValue([]);

      await service.findAll('user1', 'customer', { status: 'COMPLETED' });

      expect(mockPrisma.jobRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return a job if customer owns it', async () => {
      const job = { id: 'jr1', description: 'Test', customerId: 'cust1' };
      mockPrisma.jobRequest.findUnique.mockResolvedValue(job);

      const result = await service.findById('jr1', 'cust1', 'customer');
      expect(result).toEqual(job);
    });

    it('should throw NotFoundException if customer does not own it', async () => {
      const job = { id: 'jr1', description: 'Test', customerId: 'cust1' };
      mockPrisma.jobRequest.findUnique.mockResolvedValue(job);

      await expect(service.findById('jr1', 'other_cust', 'customer')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.jobRequest.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user1', 'customer')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a job if customer owns it', async () => {
      mockPrisma.jobRequest.findUnique.mockResolvedValue({ id: 'jr1', customerId: 'cust1' });
      const updated = { id: 'jr1', status: 'ACCEPTED' };
      mockPrisma.jobRequest.update.mockResolvedValue(updated);

      const result = await service.update('jr1', { status: 'ACCEPTED' } as any, 'cust1', 'customer');
      expect(result.status).toBe('ACCEPTED');
    });

    it('should throw NotFoundException if customer does not own it on update', async () => {
      mockPrisma.jobRequest.findUnique.mockResolvedValue({ id: 'jr1', customerId: 'cust1' });

      await expect(service.update('jr1', { status: 'ACCEPTED' } as any, 'other_cust', 'customer')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrisma.jobRequest.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', {} as any, 'user1', 'customer')).rejects.toThrow(NotFoundException);
    });
  });
});
