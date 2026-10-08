import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../database/prisma.service';

describe('ChatService', () => {
  let service: ChatService;
  const mockPrisma = {
    chatThread: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    chatMessage: { findMany: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
    $transaction: jest.fn(async (ops: any[]) => Promise.all(ops)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(ChatService);
  });
  afterEach(() => jest.resetAllMocks());
  beforeEach(() => mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops)));

  const thread = { id: 't1', participants: [{ id: 'a' }, { id: 'b' }] };

  it('non-participants get 404 for messages', async () => {
    mockPrisma.chatThread.findFirst.mockResolvedValue(null);
    await expect(service.getMessages('t1', 'intruder')).rejects.toThrow(NotFoundException);
    expect(mockPrisma.chatMessage.findMany).not.toHaveBeenCalled();
  });

  it('thread lookup is scoped to the requesting participant', async () => {
    mockPrisma.chatThread.findFirst.mockResolvedValue(thread);
    await service.requireThread('t1', 'a');
    expect(mockPrisma.chatThread.findFirst.mock.calls[0][0].where).toEqual({
      id: 't1',
      participants: { some: { id: 'a' } },
    });
  });

  it('derives the receiver from the thread, not from the client', async () => {
    mockPrisma.chatThread.findFirst.mockResolvedValue(thread);
    mockPrisma.chatMessage.create.mockReturnValue(Promise.resolve({ id: 'm1' }));
    mockPrisma.chatThread.update.mockReturnValue(Promise.resolve({}));
    await service.sendMessage('a', { threadId: 't1', text: 'hello' });
    expect(mockPrisma.chatMessage.create.mock.calls[0][0].data).toMatchObject({ senderId: 'a', receiverId: 'b' });
  });

  it('cannot send into a thread you are not in', async () => {
    mockPrisma.chatThread.findFirst.mockResolvedValue(null);
    await expect(service.sendMessage('x', { threadId: 't1', text: 'hi' })).rejects.toThrow(NotFoundException);
    expect(mockPrisma.chatMessage.create).not.toHaveBeenCalled();
  });

  it('mark-read only touches messages addressed to the reader', async () => {
    mockPrisma.chatThread.findFirst.mockResolvedValue(thread);
    await service.markAsRead('t1', 'a');
    expect(mockPrisma.chatMessage.updateMany.mock.calls[0][0].where).toEqual({
      threadId: 't1', receiverId: 'a', isRead: false,
    });
  });
});
