import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UnauthorizedException } from '@nestjs/common';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  const mockChatService = {
    getThreadsForUser: jest.fn(),
    getThreadsByUserId: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    markAsRead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyThreads', () => {
    it('should call getThreadsForUser', async () => {
      mockChatService.getThreadsForUser.mockResolvedValue([]);
      const result = await controller.getMyThreads('user1');
      expect(result).toEqual([]);
      expect(mockChatService.getThreadsForUser).toHaveBeenCalledWith('user1');
    });
  });

  describe('getThreadsByUserId', () => {
    it('should call getThreadsByUserId if authorized', async () => {
      mockChatService.getThreadsByUserId.mockResolvedValue([]);
      const result = await controller.getThreadsByUserId('user1', 'user1');
      expect(result).toEqual([]);
      expect(mockChatService.getThreadsByUserId).toHaveBeenCalledWith('user1');
    });

    it('should throw UnauthorizedException if not authorized', async () => {
      expect(() => controller.getThreadsByUserId('user1', 'user2')).toThrow(UnauthorizedException);
    });
  });

  describe('getMessages', () => {
    it('should call getMessages', async () => {
      mockChatService.getMessages.mockResolvedValue([]);
      const result = await controller.getMessages('thread1', 'user1');
      expect(result).toEqual([]);
      expect(mockChatService.getMessages).toHaveBeenCalledWith('thread1', 'user1');
    });
  });

  describe('sendMessage', () => {
    it('should call sendMessage', async () => {
      const dto = { threadId: 't1', receiverId: 'r1', text: 'hello' };
      mockChatService.sendMessage.mockResolvedValue({ id: 'msg1' });
      const result = await controller.sendMessage('user1', dto);
      expect(result).toEqual({ id: 'msg1' });
      expect(mockChatService.sendMessage).toHaveBeenCalledWith('user1', dto);
    });
  });

  describe('markRead', () => {
    it('should call markAsRead if authorized', async () => {
      const dto = { threadId: 't1', userId: 'user1' };
      mockChatService.markAsRead.mockResolvedValue({ success: true });
      const result = await controller.markRead(dto, 'user1');
      expect(result).toEqual({ success: true });
      expect(mockChatService.markAsRead).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException if not authorized', async () => {
      const dto = { threadId: 't1', userId: 'user1' };
      expect(() => controller.markRead(dto, 'user2')).toThrow(UnauthorizedException);
    });
  });
});
