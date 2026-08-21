import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Determine if this instance is running in Admin portal or Client portal
  const isAdminPortal = typeof window !== 'undefined' && window.location.pathname.includes('admin');
  const userKey = isAdminPortal ? 'venue_admin_user' : 'venue_client_user';
  const tokenKey = isAdminPortal ? 'venue_admin_token' : 'venue_client_token';

  // Read session for this specific portal immediately on startup
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(userKey);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists for this portal, verify user profile from backend
    const token = localStorage.getItem(tokenKey);
    if (token) {
      api.getProfile()
        .then(res => {
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem(userKey, JSON.stringify(res.user));
          }
        })
        .catch(err => {
          console.warn('Session verification notice:', err.message);
        });
    }

    // Sync only changes for this portal's user key
    const handleStorageChange = (e) => {
      if (e.key === userKey) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userKey, tokenKey]);

  const switchUser = (selectedUser) => {
    setUser(selectedUser);
    if (selectedUser) {
      localStorage.setItem(userKey, JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem(userKey);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.token) {
        localStorage.setItem(tokenKey, res.token);
      }
      if (res.user) {
        localStorage.setItem(userKey, JSON.stringify(res.user));
        setUser(res.user);
      }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
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
