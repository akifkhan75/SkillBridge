import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from './api';

interface AuthValue {
  user: api.AdminUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.setExpiredHandler(() => setUser(null));
    api.restore().then(setUser).finally(() => setReady(true));
    return () => api.setExpiredHandler(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await api.login(email.trim(), password));
  }, []);
  const signOut = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, signIn, signOut }), [user, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
