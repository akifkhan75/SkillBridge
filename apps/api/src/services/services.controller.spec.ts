import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockServicesService = {
    findAllPackages: jest.fn(),
    findPackageById: jest.fn(),
    findAllPlans: jest.fn(),
    findPlanById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllPackages', () => {
    it('should call findAllPackages', async () => {
      mockServicesService.findAllPackages.mockResolvedValue([]);
      const result = await controller.findAllPackages();
      expect(result).toEqual([]);
      expect(mockServicesService.findAllPackages).toHaveBeenCalled();
    });
  });

  describe('findPackageById', () => {
    it('should call findPackageById', async () => {
      mockServicesService.findPackageById.mockResolvedValue({ id: '1' });
      const result = await controller.findPackageById('1');
      expect(result).toEqual({ id: '1' });
      expect(mockServicesService.findPackageById).toHaveBeenCalledWith('1');
    });
  });

  describe('findAllPlans', () => {
    it('should call findAllPlans', async () => {
      mockServicesService.findAllPlans.mockResolvedValue([]);
      const result = await controller.findAllPlans();
      expect(result).toEqual([]);
      expect(mockServicesService.findAllPlans).toHaveBeenCalled();
    });
  });

  describe('findPlanById', () => {
    it('should call findPlanById', async () => {
      mockServicesService.findPlanById.mockResolvedValue({ id: '1' });
      const result = await controller.findPlanById('1');
      expect(result).toEqual({ id: '1' });
      expect(mockServicesService.findPlanById).toHaveBeenCalledWith('1');
    });
  });
});
