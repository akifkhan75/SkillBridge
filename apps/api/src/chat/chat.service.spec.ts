import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../database/prisma.service';

describe('ChatService', () => {
  let service: ChatService;

  const mockPrisma = {
    chatThread: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    chatMessage: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getThreadsForUser', () => {
    it('should return threads for a user', async () => {
      const threads = [{ id: 'thread1', participants: [] }];
      mockPrisma.chatThread.findMany.mockResolvedValue(threads);

      const result = await service.getThreadsForUser('user1');
      expect(result).toEqual(threads);
    });
  });

  describe('getMessages', () => {
    it('should return messages for a thread', async () => {
      mockPrisma.chatThread.findUnique.mockResolvedValue({ id: 'thread1', participants: [{ id: 'user1' }] });
      const messages = [{ id: 'msg1', text: 'Hello' }];
      mockPrisma.chatMessage.findMany.mockResolvedValue(messages);

      const result = await service.getMessages('thread1', 'user1');
      expect(result).toEqual(messages);
    });

    it('should throw NotFoundException if user is not a participant', async () => {
      mockPrisma.chatThread.findUnique.mockResolvedValue({ id: 'thread1', participants: [{ id: 'user2' }] });
      
      await expect(service.getMessages('thread1', 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent thread', async () => {
      mockPrisma.chatThread.findUnique.mockResolvedValue(null);

      await expect(service.getMessages('nonexistent', 'user1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendMessage', () => {
    it('should create a message and update thread', async () => {
      mockPrisma.chatThread.findUnique.mockResolvedValue({ id: 'thread1', participants: [{ id: 'user1' }, { id: 'user2' }] });
      
      const message = { id: 'msg1', text: 'Hello', threadId: 'thread1' };
      mockPrisma.chatMessage.create.mockResolvedValue(message);
      mockPrisma.chatThread.update.mockResolvedValue({});

      const result = await service.sendMessage('user1', {
        threadId: 'thread1',
        receiverId: 'user2',
        text: 'Hello',
      });

      expect(result).toEqual(message);
      expect(mockPrisma.chatThread.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'thread1' },
        }),
      );
    });

    it('should throw NotFoundException if user is not in thread', async () => {
      mockPrisma.chatThread.findUnique.mockResolvedValue({ id: 'thread1', participants: [{ id: 'user2' }, { id: 'user3' }] });
      
      await expect(service.sendMessage('user1', {
        threadId: 'thread1',
        receiverId: 'user2',
        text: 'Hello',
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('should mark messages as read', async () => {
      mockPrisma.chatMessage.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAsRead({
        threadId: 'thread1',
        userId: 'user1',
      });

      expect(result).toEqual({ success: true });
      expect(mockPrisma.chatMessage.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            threadId: 'thread1',
            receiverId: 'user1',
            isRead: false,
          }),
        }),
      );
    });
  });
});
