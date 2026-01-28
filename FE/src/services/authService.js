import apiClient from './api';
import { tokenManager } from './tokenManager';
import { setStorage, getStorage, removeStorage } from 'zmp-sdk/apis';

// Authentication Services
export const authService = {
  // Sign Up
  signUp: async (userData) => {
    return await apiClient.post('/auth/sign_up', { user: userData });
  },

  // Sign In
  signIn: async (email, password) => {
    const response = await apiClient.post('/auth/sign_in', {
      user: { email, password }
    });

    if ((response.status === 'ok' || response.status === 'success') && response.data) {
       const userData = response.data;
       
       // Update in-memory manager
       tokenManager.setToken(userData.access_token);
       tokenManager.setUser(userData);
       
       // Persist to Zalo Storage
       try {
         await setStorage({
           data: {
             access_token: userData.access_token,
             user: userData,
             tenant: 'default' // or dynamic if needed
           }
         });
       } catch (error) {
         console.error('Failed to save auth data to Zalo storage:', error);
       }
    }
    return response;
  },

  // Sign Out (clear local storage)
  signOut: async () => {
    tokenManager.clear();
    try {
      await removeStorage({ keys: ['access_token', 'user', 'tenant'] });
    } catch (error) {
       console.error('Failed to clear Zalo storage:', error);
    }
  },

  // Get current user from memory (or init should have loaded it)
  getCurrentUser: () => {
    return tokenManager.getUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!tokenManager.getToken();
  },
  
  // Helper to init from storage (called by AuthContext)
  initFromStorage: async () => {
    try {
      const { access_token, user, tenant } = await getStorage({ keys: ['access_token', 'user', 'tenant'] });
      if (access_token) {
        tokenManager.setToken(access_token);
        if (user) tokenManager.setUser(user);
        if (tenant) tokenManager.setTenant(tenant);
        return user;
      }
    } catch (error) {
      console.error('Failed to load from Zalo storage:', error);
    }
    return null;
  }
};
