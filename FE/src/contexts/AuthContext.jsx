import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.initFromStorage();
      if (currentUser) {
        setUser(currentUser);
        // Refresh user data from backend to get latest role
        try {
          const response = await userService.getUser(currentUser.id);
          if (response.status === 'ok' || response.status === 'success') {
            const freshUser = { ...currentUser, ...response.data };
            // Handle role from nested object if needed
            if (response.data.role && typeof response.data.role === 'object') {
              freshUser.role = response.data.role.role || response.data.role.name;
            }
            setUser(freshUser);
            // Update in memory and storage (optional, but good for consistency)
            tokenManager.setUser(freshUser);
          }
        } catch (error) {
          console.error('Failed to refresh user on init:', error);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const formatError = (response) => {
    if (response.errors) {
      if (typeof response.errors === 'object' && !Array.isArray(response.errors)) {
        return Object.entries(response.errors)
          .map(([key, msgs]) => {
            const msgStr = Array.isArray(msgs) ? msgs.join(', ') : msgs;
            
            // Skip field name for 'base' errors
            if (key === 'base') return msgStr;

            // Map backend keys to translation keys
            const fieldMapping = {
              email: 'auth.email',
              password: 'auth.password',
              password_confirmation: 'auth.confirmPassword',
              first_name: 'auth.firstName',
              last_name: 'auth.lastName',
              phone_number: 'auth.phone'
            };

            const labelKey = fieldMapping[key] || `auth.${key}`;
            const label = t(labelKey) !== labelKey ? t(labelKey) : (key.charAt(0).toUpperCase() + key.slice(1));
            
            return `${label} ${msgStr}`;
          })
          .join('. ');
      } else if (typeof response.errors === 'string') {
        return response.errors;
      } else if (Array.isArray(response.errors)) {
        return response.errors.join('. ');
      }
    }
    return response.message || t('common.error') || 'Action failed';
  };

  const login = async (email, password) => {
    try {
      const response = await authService.signIn(email, password);

      if ((response.status === 'ok' || response.status === 'success') && response.data) {
        const userData = response.data;
        // Handle role from nested object if needed
        if (userData.role && typeof userData.role === 'object') {
          userData.role = userData.role.role || userData.role.name;
        }
        // localStorage is handled in authService.signIn via tokenManager/ZaloStorage
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: formatError(response) || 'Login failed' };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.error === 'Network Error' || error.message?.includes('Network Error')) {
        errorMessage = error.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại URL API hoặc kết nối mạng.';
      } else if (error.errors) {
         // Handle errors object in catch block if api rejects with it
         errorMessage = formatError({ errors: error.errors }); 
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.signUp(userData);
      if (response.status === 'ok' || response.status === 'success') {
        return await login(userData.email, userData.password);
      }
      return { success: false, error: formatError(response) || 'Registration failed' };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.error === 'Network Error' || error.message?.includes('Network Error')) {
        errorMessage = error.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại URL API hoặc kết nối mạng.';
      } else if (error.errors) {
         errorMessage = formatError({ errors: error.errors });
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.signOut();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    tokenManager.setUser(newUser);
    // Ideally update Zalo Storage too
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const response = await userService.getUser(user.id);
      if (response.status === 'ok' || response.status === 'success') {
        const freshUser = { ...user, ...response.data };
        setUser(freshUser);
        tokenManager.setUser(freshUser);
        return freshUser;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
    return null;
  };

  // Check if user is admin - handle multiple formats
  const isAdmin =
    user?.role === 'admin' ||
    user?.role?.role === 'admin' ||
    user?.role?.name === 'admin' ||
    user?.is_admin === true;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

