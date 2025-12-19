import apiClient from './api';

// Authentication Services
export const authService = {
  // Sign Up
  signUp: async (userData) => {
    return await apiClient.post('/auth/sign_up', { user: userData });
  },

  // Sign In
  signIn: async (email, password) => {
    return await apiClient.post('/auth/sign_in', {
      user: { email, password }
    });
  },

  // Sign Out (clear local storage)
  signOut: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

