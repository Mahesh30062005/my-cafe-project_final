import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'authSession';

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isExpired(session) {
  if (!session?.expiresAt) return true;
  const exp = new Date(session.expiresAt);
  return Number.isNaN(exp.getTime()) || exp.getTime() <= Date.now();
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = loadSession();
    if (stored && !isExpired(stored)) return stored;
    if (stored) localStorage.removeItem(STORAGE_KEY);
    return null;
  });

  const login = (data) => {
    const next = {
      token: data.token,
      role: data.role,
      expiresAt: data.expiresAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(() => ({
    session,
    isAuthenticated: !!session && !isExpired(session),
    login,
    logout,
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getAuthToken() {
  const session = loadSession();
  return session?.token ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
}
