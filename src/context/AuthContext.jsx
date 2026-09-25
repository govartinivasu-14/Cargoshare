import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { wsService } from '../services/websocket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cargoshare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cargoshare_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      wsService.connect();
      return () => wsService.disconnect();
    } else {
      wsService.disconnect();
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== 'PROVIDER') return;
    const refresh = () => api.get('/provider/dashboard').then(r => {
      setUser(previous => {
        if (!previous || previous.providerStatus === r.data.providerStatus) return previous;
        const next = { ...previous, providerStatus: r.data.providerStatus };
        localStorage.setItem('cargoshare_user', JSON.stringify(next)); return next;
      });
    }).catch(() => {});
    refresh(); const timer = setInterval(refresh, 10000); return () => clearInterval(timer);
  }, [token, user?.role]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, userId, name, role, providerStatus } = res.data;
      const userData = { id: userId, name, email, role, providerStatus };
      
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('cargoshare_token', jwtToken);
      localStorage.setItem('cargoshare_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.response?.data?.message || err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cargoshare_token');
    localStorage.removeItem('cargoshare_user');
    wsService.disconnect();
  };

  const registerTrader = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register/trader', data);
      const { token: jwtToken, userId, name, email, role } = res.data;
      const userData = { id: userId, name, email, role, providerStatus: null };
      
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('cargoshare_token', jwtToken);
      localStorage.setItem('cargoshare_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      const responseMessage = err.response?.data?.message || err.response?.data?.error;
      return { success: false, message: responseMessage || err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const registerProvider = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register/provider', data);
      const { token: jwtToken, userId, name, email, role, providerStatus } = res.data;
      const userData = { id: userId, name, email, role, providerStatus: providerStatus || 'PENDING' };
      
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('cargoshare_token', jwtToken);
      localStorage.setItem('cargoshare_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        registerTrader,
        registerProvider,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
