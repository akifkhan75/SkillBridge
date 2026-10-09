import { Test, TestingModule } from '@nestjs/testing';
import { SafetyController } from './safety.controller';
import { SafetyService } from './safety.service';

describe('SafetyController', () => {
  let controller: SafetyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafetyController],
      providers: [
        { provide: SafetyService, useValue: {} },
      ],
    }).compile();

    controller = module.get<SafetyController>(SafetyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
