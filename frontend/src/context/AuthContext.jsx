import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 2,
    name: 'Alexander Morgan',
    email: 'alex.morgan@acmecorp.com',
    role: 'CUSTOMER',
    company: 'Acme Global Innovations',
    phone: '+1 (555) 342-8901'
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
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('venue_auth_token', res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('venue_auth_token');
    // Default back to demo client
    if (demoUsers.length > 1) {
      setUser(demoUsers[1]);
    }
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
