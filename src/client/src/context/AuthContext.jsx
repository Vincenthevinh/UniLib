import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/endpoints';
import { getToken, clearToken } from '../services/client';

const AuthContext = createContext(null);

function isUnauthorizedError(err) {
  return (
    err?.status === 401 ||
    err?.error?.status === 401 ||
    err?.code === 'UNAUTHORIZED' ||
    err?.code === 'INVALID_CREDENTIALS' ||
    err?.error?.code === 'UNAUTHORIZED'
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [initializing, setInitializing] = useState(true);

  const forceLogout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const currentToken = getToken();
    setTokenState(currentToken);
    if (!currentToken) {
      setUser(null);
      setInitializing(false);
      return null;
    }
    try {
      const me = await api.auth.me();
      const profile = me?.user || me;
      setUser(profile);
      return profile;
    } catch (err) {
      if (isUnauthorizedError(err)) {
        forceLogout();
      }
      return null;
    } finally {
      setInitializing(false);
    }
  }, [forceLogout]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (credentials) => {
    const result = await api.auth.login(credentials);
    const nextToken = result?.token || getToken();
    setTokenState(nextToken || null);
    const profile = result?.user || (await api.auth.me());
    setUser(profile);
    return { token: nextToken, user: profile };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      forceLogout();
    }
  }, [forceLogout]);

  const handleApiError = useCallback(
    (err) => {
      if (isUnauthorizedError(err)) {
        forceLogout();
        return true;
      }
      return false;
    },
    [forceLogout]
  );

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    initializing,
    login,
    logout,
    refreshSession,
    handleApiError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;