import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { QuotesService } from './quotes.service';

describe('QuotesService', () => {
  const prisma = {
    quote: { create: jest.fn(), findMany: jest.fn(), updateMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn() },
  };
  const access = { requireAssignedWorker: jest.fn(), requireParticipant: jest.fn() };
  const audit = { record: jest.fn() };
  const svc = new QuotesService(prisma as any, access as any, audit as any);
  afterEach(() => jest.resetAllMocks());

  it('only the assigned worker can quote', async () => {
    access.requireAssignedWorker.mockRejectedValue(new ForbiddenException());
    await expect(svc.create('w1', { jobRequestId: 'j1', totalAmount: 5000 })).rejects.toThrow(ForbiddenException);
    expect(prisma.quote.create).not.toHaveBeenCalled();
  });

  it('a new quote is always PENDING, whatever the client sends', async () => {
    access.requireAssignedWorker.mockResolvedValue({ status: 'ACCEPTED' });
    prisma.quote.create.mockResolvedValue({});
    await svc.create('w1', { jobRequestId: 'j1', totalAmount: 5000, status: 'APPROVED' } as any);
    expect(prisma.quote.create.mock.calls[0][0].data.status).toBe('PENDING');
  });

  it('refuses quotes on finished jobs', async () => {
    access.requireAssignedWorker.mockResolvedValue({ status: 'COMPLETED' });
    await expect(svc.create('w1', { jobRequestId: 'j1', totalAmount: 5000 })).rejects.toThrow(ConflictException);
  });

  it('listing requires being part of the job', async () => {
    access.requireParticipant.mockRejectedValue(new NotFoundException());
    await expect(svc.findByJob('j1', { id: 'x', type: 'customer' })).rejects.toThrow(NotFoundException);
    expect(prisma.quote.findMany).not.toHaveBeenCalled();
  });

  it('deciding is atomic, customer-scoped, and PENDING-only', async () => {
    prisma.quote.updateMany.mockResolvedValue({ count: 1 });
    prisma.quote.findUnique.mockResolvedValue({ id: 'q1' });
    await svc.updateStatus('q1', 'c1', 'APPROVED');
    expect(prisma.quote.updateMany.mock.calls[0][0].where).toEqual({
      id: 'q1', status: 'PENDING', jobRequest: { customerId: 'c1' },
    });
    expect(audit.record).toHaveBeenCalled();
  });

  it('a decided quote cannot be flipped; a stranger gets 404', async () => {
    prisma.quote.updateMany.mockResolvedValue({ count: 0 });
    prisma.quote.findFirst.mockResolvedValue({ id: 'q1' });
    await expect(svc.updateStatus('q1', 'c1', 'REJECTED')).rejects.toThrow(ConflictException);
    prisma.quote.findFirst.mockResolvedValue(null);
    await expect(svc.updateStatus('q1', 'intruder', 'APPROVED')).rejects.toThrow(NotFoundException);
  });
});
