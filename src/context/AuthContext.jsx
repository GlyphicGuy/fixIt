import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login as loginService, register as registerService, logout as logoutService } from '../services/userService';
import socketService from '../services/socketService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Connect to WebSocket
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await loginService(credentials);
      setUser(userData);
      // Connect to WebSocket
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerService(userData);
      setUser(newUser);
      // Connect to WebSocket
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
      }
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    // Disconnect from WebSocket
    socketService.disconnect();
  };

  const updateUser = (updatedUserData) => {
    // Update user in state and localStorage
    const currentUser = getCurrentUser();
    const newUserData = { ...currentUser, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

