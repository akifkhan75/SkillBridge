import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobCategory } from '@fixli/shared';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  const mockJobsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        { provide: JobsService, useValue: mockJobsService },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create', async () => {
      const dto = { description: 'test', jobType: JobCategory.PLUMBING } as any;
      mockJobsService.create.mockResolvedValue({ id: '1' });
      const result = await controller.create('user1', 'Test', dto);
      expect(result).toEqual({ id: '1' });
      expect(mockJobsService.create).toHaveBeenCalledWith('user1', 'Test', dto);
    });
  });

  describe('findAll', () => {
    it('should call findAll with filters', async () => {
      mockJobsService.findAll.mockResolvedValue([]);
      const result = await controller.findAll('user1', 'customer', 'OPEN', 'PLUMBING');
      expect(result).toEqual([]);
      expect(mockJobsService.findAll).toHaveBeenCalledWith('user1', 'customer', { status: 'OPEN', jobType: 'PLUMBING' });
    });
  });

  describe('findOne', () => {
    it('should call findById', async () => {
      mockJobsService.findById.mockResolvedValue({ id: '1' });
      const result = await controller.findOne('1', 'user1', 'customer');
      expect(result).toEqual({ id: '1' });
      expect(mockJobsService.findById).toHaveBeenCalledWith('1', 'user1', 'customer');
    });
  });

  describe('update', () => {
    it('should call update', async () => {
      const dto = { status: 'ACCEPTED' } as any;
      mockJobsService.update.mockResolvedValue({ id: '1' });
      const result = await controller.update('1', dto, 'user1', 'customer');
      expect(result).toEqual({ id: '1' });
      expect(mockJobsService.update).toHaveBeenCalledWith('1', dto, 'user1', 'customer');
    });
  });

  describe('replace', () => {
    it('should call update', async () => {
      const dto = { status: 'ACCEPTED' } as any;
      mockJobsService.update.mockResolvedValue({ id: '1' });
      const result = await controller.replace('1', dto, 'user1', 'customer');
      expect(result).toEqual({ id: '1' });
      expect(mockJobsService.update).toHaveBeenCalledWith('1', dto, 'user1', 'customer');
    });
  });
});
