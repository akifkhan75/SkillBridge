import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { ConnectionStatus, Envelope, realtime, RealtimeType } from '../services/socket';

/** Run `handler` for each live event of these types. */
export function useRealtime(types: RealtimeType[], handler: (e: Envelope) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  const key = types.join(',');
  useEffect(() => {
    const offs = types.map((t) => realtime.on(t, (e) => ref.current(e)));
    return () => offs.forEach((off) => off());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/**
 * Keep a screen's data current without polling: reload when a matching event arrives, when the
 * connection comes back after a gap, and when the app returns to the foreground. A slow fallback
 * interval (default 2 min) covers anything missed, e.g. a proxy that silently drops websockets.
 */
export function useLiveReload(
  reload: () => unknown,
  types: RealtimeType[],
  matches: (e: Envelope) => boolean = () => true,
  opts: { enabled?: boolean; fallbackMs?: number } = {},
) {
  const { enabled = true, fallbackMs = 120_000 } = opts;
  const r = useRef(reload);
  r.current = reload;
  const m = useRef(matches);
  m.current = matches;
  const last = useRef(0);

  // Several events in a burst (offer + notification + job) cause one reload, not three.
  const schedule = useRef<ReturnType<typeof setTimeout> | null>(null);
  const kick = () => {
    if (schedule.current) return;
    schedule.current = setTimeout(() => { schedule.current = null; last.current = Date.now(); void r.current(); }, 150);
  };

  useRealtime(types, (e) => { if (enabled && m.current(e)) kick(); });

  useEffect(() => {
    if (!enabled) return undefined;
    const offResync = realtime.on('resync', kick);
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active' && Date.now() - last.current > 5000) kick(); });
    const t = setInterval(() => { if (AppState.currentState === 'active') kick(); }, fallbackMs);
    return () => { offResync(); sub.remove(); clearInterval(t); if (schedule.current) clearTimeout(schedule.current); schedule.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fallbackMs]);
}

export function useConnectionStatus(): ConnectionStatus {
  const [s, setS] = useState<ConnectionStatus>(realtime.status);
  useEffect(() => realtime.on('status' as any, (e) => setS(e.data)), []);
  return s;
}
