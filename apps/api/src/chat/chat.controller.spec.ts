import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  const svc = { getConversationsForUser: jest.fn(), getMessages: jest.fn(), sendMessage: jest.fn(), markAsRead: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: svc }],
    }).compile();
    controller = module.get(ChatController);
  });
  afterEach(() => jest.resetAllMocks());

  it('returns own conversations', async () => {
    svc.getConversationsForUser.mockResolvedValue({ items: [], nextCursor: null });
    await controller.getConversations('u1', 'cur');
    expect(svc.getConversationsForUser).toHaveBeenCalledWith('u1', 'cur');
  });

  it('mark-read uses the authenticated user', async () => {
    svc.markAsRead.mockResolvedValue({ success: true });
    await controller.markRead('c1', 'u1');
    expect(svc.markAsRead).toHaveBeenCalledWith('c1', 'u1');
  });

  it('send uses the authenticated sender and path param', async () => {
    svc.sendMessage.mockResolvedValue({});
    await controller.sendMessage('c1', 'u1', { text: 'hi' });
    expect(svc.sendMessage).toHaveBeenCalledWith('u1', { threadId: 'c1', text: 'hi' });
  });

  it('get messages uses path param and query params', async () => {
    svc.getMessages.mockResolvedValue({ items: [], nextCursor: null });
    await controller.getMessages('c1', 'u1', 'cur', 'bef');
    expect(svc.getMessages).toHaveBeenCalledWith('c1', 'u1', 'cur', 'bef');
  });
});
