import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Start as logged out (null) unless a user token/profile is saved in localStorage
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
    // Fetch available demo users for quick role switcher
    api.getDemoUsers()
      .then(users => setDemoUsers(users))
      .catch(err => console.error('Failed to load demo users', err));
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
      localStorage.setItem('venue_auth_token', res.token);
      localStorage.setItem('venue_current_user', JSON.stringify(res.user));
      setUser(res.user);
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
