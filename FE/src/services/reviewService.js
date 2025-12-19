import apiClient from './api';

// Review Services
export const reviewService = {
  // Get reviews for a company
  getReviews: async (companyId) => {
    return await apiClient.get(`/review?company_id=${companyId}`);
  },

  // Create review
  createReview: async (companyId, reviewData) => {
    return await apiClient.post(`/review?company_id=${companyId}`, {
      review: reviewData
    });
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return await apiClient.put(`/review/${reviewId}`, {
      review: reviewData
    });
  },

  // Delete review (Soft delete)
  deleteReview: async (reviewId) => {
    return await apiClient.put(`/review/${reviewId}/delete_review`);
  },

  // Like review
  likeReview: async (reviewId) => {
    return await apiClient.put(`/review/${reviewId}/like`);
  },

  // Dislike review
  dislikeReview: async (reviewId) => {
    return await apiClient.put(`/review/${reviewId}/dislike`);
  },
};

