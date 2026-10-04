import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: WorkersService;

  const mockWorkersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        { provide: WorkersService, useValue: mockWorkersService },
      ],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
    service = module.get<WorkersService>(WorkersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll', async () => {
      mockWorkersService.findAll.mockResolvedValue([]);
      const result = await controller.findAll('PLUMBING', 4);
      expect(result).toEqual([]);
      expect(mockWorkersService.findAll).toHaveBeenCalledWith({ skill: 'PLUMBING', minRating: 4 });
    });
  });

  describe('findOne', () => {
    it('should call findById', async () => {
      mockWorkersService.findById.mockResolvedValue({ id: '1' });
      const result = await controller.findOne('1');
      expect(result).toEqual({ id: '1' });
      expect(mockWorkersService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call update', async () => {
      const dto = { skills: ['PLUMBING'] } as any;
      mockWorkersService.update.mockResolvedValue({ id: '1' });
      const result = await controller.update('1', 'user1', 'worker', dto);
      expect(result).toEqual({ id: '1' });
      expect(mockWorkersService.update).toHaveBeenCalledWith('1', 'user1', 'worker', dto);
    });
  });

  describe('replace', () => {
    it('should call update', async () => {
      const dto = { skills: ['PLUMBING'] } as any;
      mockWorkersService.update.mockResolvedValue({ id: '1' });
      const result = await controller.replace('1', 'user1', 'worker', dto);
      expect(result).toEqual({ id: '1' });
      expect(mockWorkersService.update).toHaveBeenCalledWith('1', 'user1', 'worker', dto);
    });
  });
});
