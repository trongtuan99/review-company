import apiClient from './api';

// Favorite Services
export const favoriteService = {
  // Get all favorite companies for current user
  getFavorites: async () => {
    return await apiClient.get('/favorite');
  },

  // Add company to favorites
  addFavorite: async (companyId) => {
    return await apiClient.post('/favorite', { favorite: { company_id: companyId } });
  },

  // Remove company from favorites
  removeFavorite: async (companyId) => {
    return await apiClient.delete(`/favorite/${companyId}`);
  },

  // Check if company is favorited
  checkFavorite: async (companyId) => {
    return await apiClient.get(`/favorite/check/${companyId}`);
  },
};

