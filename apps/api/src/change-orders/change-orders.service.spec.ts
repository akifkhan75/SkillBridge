import { Test, TestingModule } from '@nestjs/testing';
import { ChangeOrdersService } from './change-orders.service';
import { PrismaService } from '../database/prisma.service';
import { JobAccessService } from '../common/access/job-access.service';
import { AuditService } from '../common/audit/audit.service';
import { ConflictException } from '@nestjs/common';

describe('ChangeOrdersService', () => {
  let service: ChangeOrdersService;

  const mockPrisma = {
    changeOrder: { create: jest.fn(), findMany: jest.fn(), updateMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn() },
  };

  const mockAccess = {
    requireAssignedWorker: jest.fn(),
    requireParticipant: jest.fn(),
  };

  const mockAudit = {
    record: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeOrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JobAccessService, useValue: mockAccess },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<ChangeOrdersService>(ChangeOrdersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a change order if job is EN_ROUTE, ARRIVED, or IN_PROGRESS', async () => {
      mockAccess.requireAssignedWorker.mockResolvedValue({ status: 'IN_PROGRESS' });
      mockPrisma.changeOrder.create.mockResolvedValue({ id: 'co1' });

      const dto = {
        jobRequestId: 'j1',
        reason: 'Extra scope',
        addedScope: 'Clean up',
        revisedPrice: 15000,
      };

      const result = await service.create('w1', dto);
      expect(result.id).toBe('co1');
      expect(mockPrisma.changeOrder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: 'PENDING',
          mediaKeys: [],
        }),
      });
    });

    it('throws ConflictException if job is not active', async () => {
      mockAccess.requireAssignedWorker.mockResolvedValue({ status: 'COMPLETED' });

      const dto = {
        jobRequestId: 'j1',
        reason: 'Extra scope',
        addedScope: 'Clean up',
        revisedPrice: 15000,
      };

      await expect(service.create('w1', dto)).rejects.toThrow(ConflictException);
    });
  });
});
