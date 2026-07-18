import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('dineease_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest('/auth/me');
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('dineease_token');
        }
      } catch (err) {
        console.error('Failed to load user session:', err.message);
        localStorage.removeItem('dineease_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/auth/login', 'POST', { email, password });
      if (data.success) {
        localStorage.setItem('dineease_token', data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      // In development/testing, we can let user set role during register if needed,
      // but by default, it will be customer.
      const data = await apiRequest('/auth/register', 'POST', { name, email, password, phone, role });
      if (data.success) {
        localStorage.setItem('dineease_token', data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dineease_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
