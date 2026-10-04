import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: AiService;

  const mockAiService = {
    analyzeServiceRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    service = module.get<AiService>(AiService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyze', () => {
    it('should call analyzeServiceRequest', async () => {
      mockAiService.analyzeServiceRequest.mockResolvedValue({});
      const result = await controller.analyze({ description: 'test' });
      expect(result).toEqual({});
      expect(mockAiService.analyzeServiceRequest).toHaveBeenCalledWith('test');
    });
  });
});
