import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from '../chat.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let service: ChatService;

  const mockChatService = {
    sendMessage: jest.fn(),
  };

  const mockSocket = (id: string, userId?: string) => ({
    id,
    handshake: { query: { userId } },
    join: jest.fn(),
    emit: jest.fn(),
  }) as any;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    service = module.get<ChatService>(ChatService);
    gateway.server = mockServer;
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('Connection & Disconnection', () => {
    it('should handle connection', () => {
      const client = mockSocket('socket1', 'user1');
      gateway.handleConnection(client);
      expect((gateway as any).userSocketMap.get('user1')).toBe('socket1');
    });

    it('should ignore connection without userId', () => {
      const client = mockSocket('socket2');
      gateway.handleConnection(client);
      expect((gateway as any).userSocketMap.has(undefined)).toBeFalsy();
    });

    it('should handle disconnect', () => {
      const client = mockSocket('socket1', 'user1');
      gateway.handleConnection(client);
      gateway.handleDisconnect(client);
      expect((gateway as any).userSocketMap.has('user1')).toBeFalsy();
    });
  });

  describe('handleMessage', () => {
    it('should handle message and emit to receiver', async () => {
      const sender = mockSocket('socket1', 'user1');
      gateway.handleConnection(sender);
      
      const receiver = mockSocket('socket2', 'user2');
      gateway.handleConnection(receiver);

      mockChatService.sendMessage.mockResolvedValue({ id: 'msg1' });
      
      await gateway.handleMessage(sender, { threadId: 't1', receiverId: 'user2', text: 'hi' });
      
      expect(mockServer.to).toHaveBeenCalledWith('socket2');
      expect(mockServer.emit).toHaveBeenCalledWith('newMessage', { id: 'msg1' });
      expect(sender.emit).toHaveBeenCalledWith('messageSent', { id: 'msg1' });
    });
  });

  describe('handleJoinThread', () => {
    it('should join thread', () => {
      const client = mockSocket('socket1', 'user1');
      gateway.handleJoinThread(client, { threadId: 't1' });
      expect(client.join).toHaveBeenCalledWith('thread:t1');
    });
  });

  describe('handleTyping', () => {
    it('should emit typing event', () => {
      const sender = mockSocket('socket1', 'user1');
      const receiver = mockSocket('socket2', 'user2');
      gateway.handleConnection(receiver);

      gateway.handleTyping(sender, { threadId: 't1', receiverId: 'user2' });
      
      expect(mockServer.to).toHaveBeenCalledWith('socket2');
      expect(mockServer.emit).toHaveBeenCalledWith('userTyping', { threadId: 't1', userId: 'user1' });
    });
  });

  describe('handleLocationUpdate', () => {
    it('should emit location update', () => {
      const worker = mockSocket('socket1', 'worker1');
      const customer = mockSocket('socket2', 'customer1');
      gateway.handleConnection(customer);

      gateway.handleLocationUpdate(worker, { receiverId: 'customer1', latitude: 10, longitude: 20 });
      
      expect(mockServer.to).toHaveBeenCalledWith('socket2');
      expect(mockServer.emit).toHaveBeenCalledWith('locationUpdate', { workerId: 'worker1', latitude: 10, longitude: 20, heading: undefined });
    });
  });
});
