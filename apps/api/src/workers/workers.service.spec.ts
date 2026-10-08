import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { WorkersService } from './workers.service';

describe('WorkersService', () => {
  const tx = { portfolioItem: { create: jest.fn() }, verificationCase: { create: jest.fn().mockResolvedValue({ id: 'case1' }) } };
  const prisma: any = {
    worker: { findMany: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    serviceCategory: { findMany: jest.fn() },
    workerService: { deleteMany: jest.fn(), createMany: jest.fn() },
    workingHours: { deleteMany: jest.fn(), createMany: jest.fn() },
    portfolioItem: { count: jest.fn(), findFirst: jest.fn(), delete: jest.fn() },
    review: { aggregate: jest.fn() },
    jobRequest: { count: jest.fn() },
    $transaction: jest.fn(),
  };
  const storage = { publicUrl: (k: string) => `http://cdn/${k}`, consume: jest.fn() };
  const audit = { record: jest.fn() };
  const events = { emit: jest.fn() };
  const svc = new WorkersService(prisma, storage as any, audit as any, events as any);

  beforeEach(() => {
    tx.verificationCase.create.mockResolvedValue({ id: 'case1' });
    prisma.$transaction.mockImplementation(async (arg: any) => (typeof arg === 'function' ? arg(tx) : Promise.all(arg)));
  });
  afterEach(() => jest.clearAllMocks());

  const ownProfile = (over: any = {}) => ({
    id: 'w1', activationStatus: 'ONBOARDING', services: [], workingHours: [], portfolio: [], verifications: [],
    serviceLat: null, serviceLng: null, serviceRadius: 10, pricingModel: null, minimumCallOutFee: null, hourlyRate: null, ...over,
  });

  describe('public data', () => {
    it('never selects contact details or documents', async () => {
      prisma.worker.findMany.mockResolvedValue([]);
      await svc.findAll();
      const select = JSON.stringify(prisma.worker.findMany.mock.calls[0][0].select);
      expect(select).not.toMatch(/email|phone|documentKeys|serviceLat|serviceLng/);
    });

    it('lists only ACTIVE workers', async () => {
      prisma.worker.findMany.mockResolvedValue([]);
      await svc.findAll({ skill: 'PLUMBING', minRating: 4 });
      const where = prisma.worker.findMany.mock.calls[0][0].where;
      expect(where).toMatchObject({ activationStatus: 'ACTIVE', rating: { gte: 4 }, services: { some: { category: { name: 'PLUMBING' } } } });
    });

    it('404 for a worker who is not active', async () => {
      prisma.worker.findFirst.mockResolvedValue(null);
      await expect(svc.findPublicById('w1')).rejects.toThrow(NotFoundException);
    });

    const publicRow = (over: any = {}) => ({
      id: 'w1', hidePhotoUntilBooked: true, user: { id: 'w1', name: 'A', profileImageUrl: 'avatar/w1/a.jpg' },
      portfolio: [{ id: 'p', title: 'Sink', description: null, photoKeys: ['portfolio/w1/x.jpg'] }],
      verifications: [{ type: 'ID', reviewedAt: new Date('2026-01-01'), expiresAt: null }], ...over,
    });
    beforeEach(() => {
      prisma.review.aggregate.mockResolvedValue({ _count: 3 });
      prisma.jobRequest.count.mockResolvedValue(0);
    });

    it('hides the photo until the viewer has booked this worker', async () => {
      prisma.worker.findFirst.mockResolvedValue(publicRow());
      const anon = await svc.findPublicById('w1', { id: 'c1', type: 'customer' });
      expect(anon.user.profileImageUrl).toBeNull();

      prisma.jobRequest.count.mockResolvedValue(1); // viewer has an accepted job with them
      const booked = await svc.findPublicById('w1', { id: 'c1', type: 'customer' });
      expect(booked.user.profileImageUrl).toBe('avatar/w1/a.jpg');
    });

    it('shows badges only from approved checks, with date, and turns portfolio keys into URLs', async () => {
      prisma.worker.findFirst.mockResolvedValue(publicRow({ hidePhotoUntilBooked: false }));
      const res = await svc.findPublicById('w1', { id: 'c1', type: 'customer' });
      expect(res.badges).toEqual([{ type: 'ID', verifiedAt: new Date('2026-01-01'), expiresAt: null }]);
      expect(res.portfolio[0].photos).toEqual(['http://cdn/portfolio/w1/x.jpg']);
      expect(prisma.worker.findFirst.mock.calls[0][0].select.verifications.where).toEqual({ status: 'APPROVED' });
    });
  });

  describe('own profile', () => {
    it('own profile exposes document status but never document locations', async () => {
      prisma.worker.findUnique.mockResolvedValue(ownProfile({
        verifications: [{ id: 'v1', type: 'ID', status: 'SUBMITTED', documentKeys: ['verification/w1/a.jpg'], reason: null, createdAt: new Date() }],
      }));
      const res = await svc.findOwn('w1');
      expect(JSON.stringify(res)).not.toContain('verification/w1/a.jpg');
      expect(res.onboarding.complete).toBe(false);
    });

    it('cannot go online until approved', async () => {
      prisma.worker.findUnique.mockResolvedValue({ activationStatus: 'PENDING_REVIEW', serviceLat: null, serviceLng: null });
      await expect(svc.update('w1', { isOnline: true })).rejects.toMatchObject({ response: { code: 'WORKER_NOT_ACTIVE' } });
      expect(prisma.worker.update).not.toHaveBeenCalled();
    });

    it('going offline is always allowed', async () => {
      prisma.worker.findUnique.mockResolvedValue({ ...ownProfile(), activationStatus: 'ONBOARDING' });
      prisma.worker.update.mockResolvedValue({});
      await expect(svc.update('w1', { isOnline: false })).resolves.toBeDefined();
    });
  });

  describe('skills and hours', () => {
    it('rejects unknown or inactive categories', async () => {
      prisma.serviceCategory.findMany.mockResolvedValue([{ id: 'c1' }]);
      await expect(svc.setSkills('w1', { categoryIds: ['c1', 'ghost'] })).rejects.toMatchObject({ response: { code: 'INVALID_CATEGORY' } });
      expect(prisma.workerService.createMany).not.toHaveBeenCalled();
    });

    it('rejects a day listed twice or an end before the start', async () => {
      await expect(svc.setHours('w1', { days: [{ weekday: 1, startMinute: 540, endMinute: 1080 }, { weekday: 1, startMinute: 0, endMinute: 60 }] })).rejects.toThrow(BadRequestException);
      await expect(svc.setHours('w1', { days: [{ weekday: 2, startMinute: 600, endMinute: 600 }] })).rejects.toMatchObject({ response: { code: 'INVALID_HOURS' } });
    });
  });

  describe('documents', () => {
    it('an ID needs both sides', async () => {
      await expect(svc.submitVerification('w1', { type: 'ID', uploadIds: ['a'] })).rejects.toMatchObject({ response: { code: 'ID_NEEDS_TWO_SIDES' } });
    });

    it('attaches the uploads and records a case atomically', async () => {
      prisma.worker.findUnique.mockResolvedValue(ownProfile());
      storage.consume.mockResolvedValue(['verification/w1/a.jpg', 'verification/w1/b.jpg']);
      await svc.submitVerification('w1', { type: 'ID', uploadIds: ['a', 'b'], reference: '12345-1234567-1' });
      expect(storage.consume).toHaveBeenCalledWith('w1', ['a', 'b'], 'VERIFICATION', tx);
      expect(tx.verificationCase.create.mock.calls[0][0].data).toMatchObject({ workerId: 'w1', type: 'ID' });
      expect(audit.record).toHaveBeenCalled();
    });

    it('a suspended worker cannot submit documents', async () => {
      prisma.worker.findUnique.mockResolvedValue({ activationStatus: 'SUSPENDED' });
      await expect(svc.submitVerification('w1', { type: 'SELFIE', uploadIds: ['a'] })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('submit for review', () => {
    it('is refused with the list of what is missing', async () => {
      prisma.worker.findUnique.mockResolvedValue(ownProfile());
      await expect(svc.submitForReview('w1')).rejects.toMatchObject({
        response: { code: 'PROFILE_INCOMPLETE', details: ['skills', 'area', 'hours', 'pricing', 'documents'] },
      });
      expect(prisma.worker.update).not.toHaveBeenCalled();
    });

    it('moves a complete profile to PENDING_REVIEW, once', async () => {
      const complete = ownProfile({
        services: [{ category: { id: 'c' } }], workingHours: [{ weekday: 1 }], serviceLat: 24.8, serviceLng: 67, pricingModel: 'QUOTE',
        verifications: [
          { id: 'v1', type: 'ID', status: 'SUBMITTED', documentKeys: [], createdAt: new Date() },
          { id: 'v2', type: 'SELFIE', status: 'SUBMITTED', documentKeys: [], createdAt: new Date() },
        ],
      });
      prisma.worker.findUnique.mockResolvedValue(complete);
      prisma.worker.update.mockResolvedValue({});
      await svc.submitForReview('w1');
      expect(prisma.worker.update.mock.calls[0][0].data).toEqual({ activationStatus: 'PENDING_REVIEW' });

      prisma.worker.findUnique.mockResolvedValue({ ...complete, activationStatus: 'PENDING_REVIEW' });
      await expect(svc.submitForReview('w1')).rejects.toThrow(ConflictException);
    });
  });

  describe('portfolio', () => {
    it('is capped, and you cannot delete someone else\'s item', async () => {
      prisma.portfolioItem.count.mockResolvedValue(20);
      await expect(svc.addPortfolio('w1', { title: 'x', uploadIds: ['a'] })).rejects.toMatchObject({ response: { code: 'PORTFOLIO_FULL' } });
      prisma.portfolioItem.findFirst.mockResolvedValue(null);
      await expect(svc.removePortfolio('w1', 'someone-elses')).rejects.toThrow(NotFoundException);
      expect(prisma.portfolioItem.findFirst.mock.calls[0][0].where).toEqual({ id: 'someone-elses', workerId: 'w1' });
    });
  });
});
