import api from './api';

// Register new user
export const register = async (userData) => {
  const { data } = await api.post('/users/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Login user
export const login = async (credentials) => {
  const { data } = await api.post('/users/login', credentials);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Get user profile
export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/users/profile/${userId}`);
  return data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const { data } = await api.put('/users/profile', userData);
  // Update localStorage with new data
  const currentUser = getCurrentUser();
  if (currentUser) {
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
  }
  return data;
};

// Get all fixers
export const getFixers = async () => {
  const { data } = await api.get('/users/fixers');
  return data;
};

// Report a user
export const reportUser = async (userId, reason) => {
  const { data } = await api.post(`/users/${userId}/report`, { reason });
  return data;
};
