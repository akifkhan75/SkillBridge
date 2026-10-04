import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup', async () => {
      const dto = { email: 'test@example.com', password: 'pass', name: 'Test', type: 'customer' as const };
      mockAuthService.signup.mockResolvedValue({ token: '123' });
      const result = await controller.signup(dto);
      expect(result).toEqual({ token: '123' });
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'test@example.com', password: 'pass' };
      mockAuthService.login.mockResolvedValue({ token: '123' });
      const result = await controller.login(dto);
      expect(result).toEqual({ token: '123' });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
