import { useCallback, useEffect, useState } from 'react';
import { ApiError } from './api';

/** Load -> {data, loading, error, reload}. Pages render a real error with a retry, never invented rows. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const reload = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setData(await load());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { void reload(); }, [reload]);
  return { data, loading, error, reload };
}
