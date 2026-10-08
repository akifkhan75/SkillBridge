import { ChatGateway } from './chat.gateway';

describe('ChatGateway (socket security)', () => {
  const chat = { sendMessage: jest.fn(), requireThread: jest.fn() };
  const jwt = { verify: jest.fn() };
  const prisma = { session: { findFirst: jest.fn() }, jobRequest: { findFirst: jest.fn() } };
  const emit = jest.fn();
  let gateway: ChatGateway;

  const client = (over: any = {}) => ({
    handshake: { auth: { token: 'tok' } },
    data: {},
    join: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    ...over,
  });

  beforeEach(() => {
    gateway = new ChatGateway(chat as any, jwt as any, prisma as any);
    gateway.server = { to: jest.fn().mockReturnValue({ emit }) } as any;
  });
  afterEach(() => jest.resetAllMocks());

  it('rejects a connection with no/invalid token (cannot just claim a userId)', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('bad'); });
    const c = client({ handshake: { auth: {}, query: { userId: 'victim' } } });
    await gateway.handleConnection(c as any);
    expect(c.disconnect).toHaveBeenCalledWith(true);
    expect(c.join).not.toHaveBeenCalled();
  });

  it('rejects a valid token whose session was revoked (logged out)', async () => {
    jwt.verify.mockReturnValue({ sub: 'u1', sid: 's1' });
    prisma.session.findFirst.mockResolvedValue(null);
    const c = client();
    await gateway.handleConnection(c as any);
    expect(c.disconnect).toHaveBeenCalled();
  });

  it('puts an authenticated user in their own rooms only', async () => {
    jwt.verify.mockReturnValue({ sub: 'u1', sid: 's1' });
    prisma.session.findFirst.mockResolvedValue({ user: { id: 'u1', type: 'worker' } });
    const c = client();
    await gateway.handleConnection(c as any);
    expect(c.join).toHaveBeenCalledWith(['user:u1', 'role:worker']);
    expect(c.data.userId).toBe('u1');
  });

  it('delivers messages to the receiver chosen by the server', async () => {
    chat.sendMessage.mockResolvedValue({ id: 'm1', receiverId: 'u2' });
    const c = client({ data: { userId: 'u1', userType: 'customer' } });
    await gateway.handleMessage(c as any, { threadId: 't1', text: 'hi', receiverId: 'attacker' });
    // extra fields are rejected by payload validation
    expect(chat.sendMessage).not.toHaveBeenCalled();
    await gateway.handleMessage(c as any, { threadId: 't1', text: 'hi' });
    expect(gateway.server.to).toHaveBeenCalledWith('user:u2');
  });

  it('only a worker can send location, and only to the customer of their own active job', async () => {
    const payload = { jobId: 'j1', latitude: 24.8, longitude: 67.0 };
    await gateway.handleLocationUpdate(client({ data: { userId: 'c1', userType: 'customer' } }) as any, payload);
    expect(prisma.jobRequest.findFirst).not.toHaveBeenCalled();

    prisma.jobRequest.findFirst.mockResolvedValue({ customerId: 'c9' });
    await gateway.handleLocationUpdate(client({ data: { userId: 'w1', userType: 'worker' } }) as any, payload);
    expect(prisma.jobRequest.findFirst.mock.calls[0][0].where).toMatchObject({
      id: 'j1', assignedWorkerId: 'w1',
    });
    expect(gateway.server.to).toHaveBeenCalledWith('user:c9');
  });

  it('drops location for a job the worker is not assigned to', async () => {
    prisma.jobRequest.findFirst.mockResolvedValue(null);
    await gateway.handleLocationUpdate(
      client({ data: { userId: 'w1', userType: 'worker' } }) as any,
      { jobId: 'other', latitude: 1, longitude: 1 },
    );
    expect(emit).not.toHaveBeenCalled();
  });

  it('rejects out-of-range coordinates', async () => {
    await gateway.handleLocationUpdate(
      client({ data: { userId: 'w1', userType: 'worker' } }) as any,
      { jobId: 'j1', latitude: 999, longitude: 1 },
    );
    expect(prisma.jobRequest.findFirst).not.toHaveBeenCalled();
  });
});
