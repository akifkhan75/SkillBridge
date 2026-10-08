import { Test, TestingModule } from '@nestjs/testing';
import { SafetyController } from './safety.controller';

describe('SafetyController', () => {
  let controller: SafetyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafetyController],
    }).compile();

    controller = module.get<SafetyController>(SafetyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
