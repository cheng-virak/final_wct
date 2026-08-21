import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Read saved session immediately on startup so refresh never loses login
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('venue_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, verify and refresh user profile from backend
    const token = localStorage.getItem('venue_auth_token');
    if (token) {
      api.getProfile()
        .then(res => {
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('venue_current_user', JSON.stringify(res.user));
          }
        })
        .catch(err => {
          console.warn('Session verification notice:', err.message);
        });
    }

    // Listen to storage events to sync auth state across tabs and separate pages (index.html & admin.html)
    const handleStorageChange = (e) => {
      if (e.key === 'venue_current_user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const switchUser = (selectedUser) => {
    setUser(selectedUser);
    if (selectedUser) {
      localStorage.setItem('venue_current_user', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('venue_current_user');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.token) {
        localStorage.setItem('venue_auth_token', res.token);
      }
      if (res.user) {
        localStorage.setItem('venue_current_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('venue_auth_token');
    localStorage.removeItem('venue_current_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      demoUsers,
      switchUser,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
