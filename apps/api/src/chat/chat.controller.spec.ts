import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  const svc = { getThreadsForUser: jest.fn(), getMessages: jest.fn(), sendMessage: jest.fn(), markAsRead: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: svc }],
    }).compile();
    controller = module.get(ChatController);
  });
  afterEach(() => jest.resetAllMocks());

  it('returns own threads', async () => {
    svc.getThreadsForUser.mockResolvedValue([]);
    await controller.getThreadsByUserId('u1', 'u1');
    expect(svc.getThreadsForUser).toHaveBeenCalledWith('u1');
  });

  it("refuses another user's threads", () => {
    expect(() => controller.getThreadsByUserId('u2', 'u1')).toThrow(ForbiddenException);
  });

  it('mark-read uses the authenticated user, ignoring any userId in the body', async () => {
    svc.markAsRead.mockResolvedValue({ success: true });
    await controller.markRead({ threadId: 't1', userId: 'someone-else' }, 'u1');
    expect(svc.markAsRead).toHaveBeenCalledWith('t1', 'u1');
  });

  it('send uses the authenticated sender', async () => {
    svc.sendMessage.mockResolvedValue({});
    await controller.sendMessage('u1', { threadId: 't1', text: 'hi' });
    expect(svc.sendMessage).toHaveBeenCalledWith('u1', { threadId: 't1', text: 'hi' });
  });
});
