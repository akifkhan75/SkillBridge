import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../services/api';

export interface ApiState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
  reload: () => Promise<void>;
  setData: (d: T | undefined) => void;
}

/** Plain-language message for any failure; never a raw exception string. */
export function friendlyError(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "We couldn't reach the server. Check your connection and try again.";
}

/**
 * Loads data once (and on `reload`), tracking loading + error. Screens render the three states
 * (loading / error with retry / data or empty); they never fall back to fake data.
 */
export function useApi<T>(load: () => Promise<T>, deps: unknown[] = []): ApiState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const alive = useRef(true);
  const loadRef = useRef(load);
  loadRef.current = load;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await loadRef.current();
      if (alive.current) setData(result);
    } catch (e) {
      if (alive.current) setError(friendlyError(e));
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    reload();
    return () => { alive.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload, setData };
}
