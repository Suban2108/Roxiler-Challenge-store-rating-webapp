import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api, { setTokens, clearTokens, setAuthFailureHandler } from '@/lib/api';

const AuthContext = createContext(null);

const getRolePath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'store_owner') return '/owner';
  return '/dashboard';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // ignore logout errors
    }
    clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthFailureHandler(() => {
      clearTokens();
      setUser(null);
    });

    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, accessToken, refreshToken } = res.data.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return getRolePath(loggedInUser.role);
  };

  const register = async (data) => {
    await api.post('/auth/register', data);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      getRolePath,
    }),
    [user, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
