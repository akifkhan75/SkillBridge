import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationService } from '../notifications/notifications.service';

describe('ChatService', () => {
  let service: ChatService;
  const mockPrisma: any = {
    conversation: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
    message: { findMany: jest.fn(), create: jest.fn(), updateMany: jest.fn(), findUnique: jest.fn(), groupBy: jest.fn() },
    messageRead: { createMany: jest.fn() },
    $transaction: jest.fn(async (ops: any[]) => Promise.all(ops)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService, 
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationService, useValue: { sendPushNotification: jest.fn() } }
      ],
    }).compile();
    service = module.get(ChatService);
  });
  afterEach(() => jest.resetAllMocks());
  beforeEach(() => mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops)));

  const thread = { id: 'c1', participants: [{ id: 'a' }, { id: 'b' }], isReadOnly: false };

  it('non-participants get 404 for messages', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null);
    await expect(service.getMessages('c1', 'intruder')).rejects.toThrow(NotFoundException);
    expect(mockPrisma.message.findMany).not.toHaveBeenCalled();
  });

  it('thread lookup is scoped to the requesting participant', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(thread);
    mockPrisma.message.findMany.mockResolvedValue([]);
    await service.getMessages('c1', 'a');
    expect(mockPrisma.conversation.findFirst.mock.calls[0][0].where).toEqual({
      id: 'c1',
      participants: { some: { id: 'a' } },
    });
  });

  it('cannot send into a conversation you are not in', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null);
    await expect(service.sendMessage('x', { threadId: 'c1', text: 'hi' })).rejects.toThrow(NotFoundException);
    expect(mockPrisma.message.create).not.toHaveBeenCalled();
  });

  it('cannot send into a read-only conversation', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue({ ...thread, isReadOnly: true });
    await expect(service.sendMessage('a', { threadId: 'c1', text: 'hi' })).rejects.toThrow(BadRequestException);
    expect(mockPrisma.message.create).not.toHaveBeenCalled();
  });

  it('mark-read creates messageRead records for unread messages sent by others', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(thread);
    mockPrisma.message.findMany.mockResolvedValue([{ id: 'm1' }]);
    await service.markAsRead('c1', 'a');
    
    expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
      where: {
        conversationId: 'c1',
        senderId: { not: 'a' },
        reads: { none: { userId: 'a' } }
      },
      select: { id: true }
    });
    
    expect(mockPrisma.messageRead.createMany).toHaveBeenCalledWith({
      data: [{ messageId: 'm1', userId: 'a' }],
      skipDuplicates: true
    });
  });

  it('can block a user in the conversation', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(thread);
    mockPrisma.block = { upsert: jest.fn() };
    await service.blockUser('c1', 'a', 'spam');
    expect(mockPrisma.block.upsert).toHaveBeenCalled();
    expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { isReadOnly: true }
    });
  });

  it('can report a user in the conversation', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(thread);
    mockPrisma.auditLog = { create: jest.fn() };
    await service.reportUser('c1', 'a', 'rude');
    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorId: 'a',
        action: 'REPORT_USER',
        entityId: 'b',
        after: { reason: 'rude' }
      })
    });
  });
});
