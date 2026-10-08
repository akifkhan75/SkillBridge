// ============================================================
// Token + device storage and silent refresh.
// Access tokens are short-lived (15 min); the refresh token is single-use and rotates, so the
// refresh call must be single-flight: two parallel 401s must not both spend the same token.
// ============================================================

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '../config';

const KEYS = { access: 'authToken', refresh: 'refreshToken', device: 'deviceId' } as const;

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  let deviceId = await SecureStore.getItemAsync(KEYS.device);
  if (!deviceId) {
    // Not a secret; just a stable per-install identifier so one device = one session.
    deviceId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    await SecureStore.setItemAsync(KEYS.device, deviceId);
  }
  return {
    deviceId,
    deviceName: `${Platform.OS} device`,
    platform: Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web',
  };
}

export const getAccessToken = () => SecureStore.getItemAsync(KEYS.access);

export async function saveTokens(access: string, refresh: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.access, access);
  await SecureStore.setItemAsync(KEYS.refresh, refresh);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.access);
  await SecureStore.deleteItemAsync(KEYS.refresh);
}

let onSessionExpired: (() => void) | null = null;
/** The store registers a handler so an unrecoverable 401 signs the user out of the UI. */
export function setSessionExpiredHandler(fn: (() => void) | null) {
  onSessionExpired = fn;
}

let inFlight: Promise<string | null> | null = null;

/**
 * Returns a fresh access token, or null if the session is gone (user must sign in again).
 * Throws on network failure so a flaky connection never signs anyone out.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (!inFlight) {
    inFlight = doRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync(KEYS.refresh);
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (res.ok) {
    const body = await res.json();
    await saveTokens(body.token, body.refreshToken);
    return body.token as string;
  }

  if (res.status === 409) {
    // Another refresh (e.g. from a second request) won the race; use the token it stored.
    await new Promise((r) => setTimeout(r, 400));
    return getAccessToken();
  }

  if (res.status === 401 || res.status === 403) {
    await clearTokens();
    onSessionExpired?.();
    return null;
  }

  throw new Error(`Refresh failed (${res.status})`);
}
