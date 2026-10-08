// Single source of runtime config. Fails loudly instead of silently pointing at a
// developer's LAN IP (which previously shipped as a fallback).

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_URL is not set. Copy apps/mobile/.env.example to apps/mobile/.env and set it.',
  );
}

export const API_URL = apiUrl.replace(/\/+$/, '');
// Socket.IO lives on the server origin, not under the /api prefix.
export const SOCKET_URL = API_URL.replace(/\/api(\/v\d+)?$/, '');
