import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('analyzeServiceRequest', () => {
    it('should return default analysis if API key is not set', async () => {
      mockConfigService.get.mockReturnValue(null);
      // Re-initialize to trigger constructor
      service = new AiService(mockConfigService as any);
      
      const result = await service.analyzeServiceRequest('test');
      expect(result).toEqual({
        jobType: 'Other',
        urgency: 'Medium',
        severity: 'Moderate',
        estimatedDuration: 'Not Estimated',
        priceEstimate: 'Requires Quote',
      });
    });

    it('should return default analysis if model generation fails', async () => {
      mockConfigService.get.mockReturnValue('fake-key');
      // Re-initialize to trigger constructor
      service = new AiService(mockConfigService as any);
      // Inject fake model
      (service as any).model = {
        generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
      };

      const result = await service.analyzeServiceRequest('test');
      expect(result).toEqual({
        jobType: 'Other',
        urgency: 'Medium',
        severity: 'Moderate',
        estimatedDuration: 'Not Estimated',
        priceEstimate: 'Requires Quote',
      });
    });

    it('should parse JSON successfully from model response', async () => {
      mockConfigService.get.mockReturnValue('fake-key');
      service = new AiService(mockConfigService as any);
      
      (service as any).model = {
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => '```json\n{"jobType": "Plumbing", "urgency": "High", "severity": "Major", "estimatedDuration": "2 hours", "priceEstimate": "Moderate"}\n```'
          }
        })
      };

      const result = await service.analyzeServiceRequest('test');
      expect(result).toEqual({
        jobType: 'Plumbing',
        urgency: 'High',
        severity: 'Major',
        estimatedDuration: '2 hours',
        priceEstimate: 'Moderate',
      });
    });
  });
});
