const mockStore: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (k: string) => mockStore[k] ?? null),
  setItemAsync: jest.fn(async (k: string, v: string) => { mockStore[k] = v; }),
  deleteItemAsync: jest.fn(async (k: string) => { delete mockStore[k]; }),
}));

// A tiny stand-in for socket.io-client: lets the test play the server.
type H = (...a: any[]) => void;
const mockSockets: any[] = [];
jest.mock('socket.io-client', () => ({
  io: jest.fn((url: string, opts: any) => {
    const handlers = new Map<string, H[]>();
    const s: any = {
      url, opts, connected: true,
      on: (e: string, h: H) => { handlers.set(e, [...(handlers.get(e) ?? []), h]); return s; },
      emit: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
      io: { on: jest.fn(), removeAllListeners: jest.fn() },
      server: (e: string, ...a: any[]) => (handlers.get(e) ?? []).forEach((h) => h(...a)),
    };
    mockSockets.push(s);
    return s;
  }),
}));

jest.mock('../services/session', () => ({
  getAccessToken: jest.fn(async () => mockStore.authToken ?? null),
  refreshAccessToken: jest.fn(async () => { mockStore.authToken = 'fresh'; return 'fresh'; }),
}));

import { realtime } from '../services/socket';
import { refreshAccessToken } from '../services/session';

const env = (id: string, type = 'offers.updated', data: any = { jobId: 'j1' }) => ({ id, type, occurredAt: new Date().toISOString(), data });

describe('realtime client', () => {
  beforeEach(() => { mockSockets.length = 0; mockStore.authToken = 'tok'; });
  afterEach(() => realtime.disconnect());

  it('connects to the /rt namespace and sends the current token on every (re)connect', async () => {
    await realtime.connect();
    const s = mockSockets[0];
    expect(s.url).toMatch(/\/rt$/);
    mockStore.authToken = 'newer';
    const cb = jest.fn();
    s.opts.auth(cb);
    await new Promise((r) => setTimeout(r, 0));
    expect(cb).toHaveBeenCalledWith({ token: 'newer' });
  });

  it('does not connect when signed out', async () => {
    delete mockStore.authToken;
    await realtime.connect();
    expect(mockSockets).toHaveLength(0);
  });

  it('delivers each event once, even if the server repeats it', async () => {
    await realtime.connect();
    const got = jest.fn();
    const off = realtime.on('offers.updated', got);
    mockSockets[0].server('offers.updated', env('e1'));
    mockSockets[0].server('offers.updated', env('e1'));
    mockSockets[0].server('offers.updated', env('e2'));
    expect(got).toHaveBeenCalledTimes(2);
    off();
    mockSockets[0].server('offers.updated', env('e3'));
    expect(got).toHaveBeenCalledTimes(2);
  });

  it('after a reconnect, tells screens to reload what they may have missed', async () => {
    await realtime.connect();
    const resync = jest.fn();
    realtime.on('resync', resync);
    mockSockets[0].server('ready', {});
    expect(resync).not.toHaveBeenCalled(); // first connect: screens just loaded
    mockSockets[0].server('disconnect', 'transport close');
    expect(realtime.status).toBe('connecting');
    mockSockets[0].server('ready', {});
    expect(resync).toHaveBeenCalledTimes(1);
    expect(realtime.status).toBe('online');
  });

  it('refreshes an expired token once and reconnects', async () => {
    await realtime.connect();
    mockSockets[0].server('error', { code: 'UNAUTHORIZED' });
    mockSockets[0].server('disconnect', 'io server disconnect');
    await new Promise((r) => setTimeout(r, 0));
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockSockets[0].connect).toHaveBeenCalled();
  });
});
