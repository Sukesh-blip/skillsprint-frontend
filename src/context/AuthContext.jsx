import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (token) {
      const decoded = decodeJWT(token);
      const userRole = role || decoded?.role || decoded?.roles?.[0] || 'USER';
      const name = username || decoded?.sub || decoded?.username || 'User';
      setUser({ token, role: userRole, username: name });
    }
    setLoading(false);
  }, []);

  const login = (token, roleFromApi, usernameFromApi) => {
    localStorage.setItem('token', token);
    const decoded = decodeJWT(token);

    const role = roleFromApi || decoded?.role || decoded?.roles?.[0] || 'USER';
    const name = usernameFromApi || decoded?.sub || decoded?.username || 'User';

    localStorage.setItem('role', role);
    localStorage.setItem('username', name);

    setUser({ token, role, username: name });
  };

  const logout = async () => {
    try {
      // Call logout API
      await api.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout API failed, continuing client-side cleanup:', err);
    } finally {
      // Client-side cleanup MUST happen
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      setUser(null);
      // Forced browser refresh to clear all lingering state
      window.location.href = '/login';
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
