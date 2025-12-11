import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount, if tokens exist, set them in state
  useEffect(() => {
    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } else {
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  // Login: expects backend to return accessToken and refreshToken in JSON
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register: expects backend to return accessToken and refreshToken in JSON
  const register = useCallback(async (email, username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      if (!res.ok) throw new Error('We couldn’t create your account. Please verify your details or try different credentials.');
      const data = await res.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      return data;
    } catch (err) {
      setError(err.message || 'We couldn’t create your account. Please verify your details or try different credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout: clears tokens in state and storage, backend invalidates refresh token
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  // Refresh token: called by API helpers on 401
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!refreshToken) throw new Error('No refresh token');
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      return data.accessToken;
    } catch (err) {
      setError(err.message || 'Token refresh failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, loading, error, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
