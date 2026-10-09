import { Test, TestingModule } from '@nestjs/testing';
import { SafetyService } from './safety.service';
import { PrismaService } from '../database/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { DomainEvents } from '../common/events/domain-events';

describe('SafetyService', () => {
  let service: SafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafetyService,
        { provide: PrismaService, useValue: {} },
        { provide: JobsService, useValue: {} },
        { provide: DomainEvents, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<SafetyService>(SafetyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
