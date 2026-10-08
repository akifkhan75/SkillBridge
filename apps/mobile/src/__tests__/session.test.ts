const mockStore: Record<string, string> = {};
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (k: string) => mockStore[k] ?? null),
  setItemAsync: jest.fn(async (k: string, v: string) => { mockStore[k] = v; }),
  deleteItemAsync: jest.fn(async (k: string) => { delete mockStore[k]; }),
}));

import { refreshAccessToken, setSessionExpiredHandler, getDeviceInfo } from '../services/session';
import { getCurrentUser } from '../services/api';

const res = (status: number, body: unknown) =>
  ({ ok: status < 400, status, json: async () => body, text: async () => JSON.stringify(body) }) as Response;

describe('session refresh', () => {
  beforeEach(() => {
    for (const k of Object.keys(mockStore)) delete mockStore[k];
    mockStore.authToken = 'old-access';
    mockStore.refreshToken = 'sid.old-refresh';
  });
  afterEach(() => { jest.restoreAllMocks(); setSessionExpiredHandler(null); });

  it('single-flight: parallel refreshes spend the refresh token once', async () => {
    const spy = jest.spyOn(global, 'fetch').mockResolvedValue(res(200, { token: 'new-access', refreshToken: 'sid.new-refresh' }));
    const [a, b, c] = await Promise.all([refreshAccessToken(), refreshAccessToken(), refreshAccessToken()]);
    expect([a, b, c]).toEqual(['new-access', 'new-access', 'new-access']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockStore.refreshToken).toBe('sid.new-refresh');
  });

  it('a 401 on refresh clears tokens and signs the UI out', async () => {
    const expired = jest.fn();
    setSessionExpiredHandler(expired);
    jest.spyOn(global, 'fetch').mockResolvedValue(res(401, { success: false, error: { code: 'UNAUTHORIZED', message: 'x' } }));
    expect(await refreshAccessToken()).toBeNull();
    expect(mockStore.authToken).toBeUndefined();
    expect(mockStore.refreshToken).toBeUndefined();
    expect(expired).toHaveBeenCalled();
  });

  it('a network failure during refresh does NOT sign anyone out', async () => {
    const expired = jest.fn();
    setSessionExpiredHandler(expired);
    jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Network request failed'));
    await expect(refreshAccessToken()).rejects.toThrow();
    expect(mockStore.refreshToken).toBe('sid.old-refresh');
    expect(expired).not.toHaveBeenCalled();
  });

  it('an API call that gets a 401 refreshes once and retries with the new token', async () => {
    const calls: { url: string; auth?: string }[] = [];
    jest.spyOn(global, 'fetch').mockImplementation(async (url: any, init: any) => {
      calls.push({ url: String(url), auth: init?.headers?.Authorization });
      if (String(url).endsWith('/auth/me') && init?.headers?.Authorization === 'Bearer old-access') return res(401, {});
      if (String(url).endsWith('/auth/refresh')) return res(200, { token: 'new-access', refreshToken: 'sid.new' });
      return res(200, { id: 'u1' });
    });
    await expect(getCurrentUser()).resolves.toEqual({ id: 'u1' });
    expect(calls.map((c) => c.url.split('/api')[1])).toEqual(['/auth/me', '/auth/refresh', '/auth/me']);
    expect(calls[2].auth).toBe('Bearer new-access');
  });

  it('credential endpoints never trigger a refresh loop', async () => {
    const spy = jest.spyOn(global, 'fetch').mockResolvedValue(res(401, { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Phone number or password is wrong.' } }));
    const { login } = require('../services/api');
    await expect(login('0300 1234567', 'PK', 'x')).rejects.toMatchObject({ status: 401 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('gives each install a stable device id', async () => {
    const a = await getDeviceInfo();
    const b = await getDeviceInfo();
    expect(a.deviceId).toBe(b.deviceId);
    expect(a.deviceId.length).toBeGreaterThanOrEqual(8);
  });
});
