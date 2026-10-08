import { Test } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

describe('WorkersController', () => {
  let controller: WorkersController;
  const svc = {
    findAll: jest.fn(), findPublicById: jest.fn(), findOwn: jest.fn(), update: jest.fn(), setSkills: jest.fn(),
    setHours: jest.fn(), addPortfolio: jest.fn(), removePortfolio: jest.fn(), submitVerification: jest.fn(), submitForReview: jest.fn(),
  };
  beforeEach(async () => {
    const mod = await Test.createTestingModule({ controllers: [WorkersController], providers: [{ provide: WorkersService, useValue: svc }] }).compile();
    controller = mod.get(WorkersController);
  });
  afterEach(() => jest.resetAllMocks());

  it('every "me" route is worker-only', () => {
    for (const fn of ['me', 'update', 'setSkills', 'setHours', 'addPortfolio', 'removePortfolio', 'submitVerification', 'submit'] as const) {
      expect(Reflect.getMetadata(ROLES_KEY, WorkersController.prototype[fn])).toEqual(['worker']);
    }
  });

  it('acts on the caller, never on an id from the URL, for edits', async () => {
    await controller.update('w1', { bio: 'x' });
    expect(svc.update).toHaveBeenCalledWith('w1', { bio: 'x' });
    await controller.setSkills('w1', { categoryIds: ['c1'] });
    expect(svc.setSkills).toHaveBeenCalledWith('w1', { categoryIds: ['c1'] });
  });

  it('public profile passes the viewer so photo-hiding can apply', async () => {
    await controller.findOne('w9', { id: 'c1', type: 'customer' });
    expect(svc.findPublicById).toHaveBeenCalledWith('w9', { id: 'c1', type: 'customer' });
  });

  it('has no generic update-by-id route', () => {
    expect((controller as any).replace).toBeUndefined();
    expect(controller.update.length).toBe(2);
  });
});
