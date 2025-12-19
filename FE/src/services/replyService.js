import apiClient from './api';

// Reply Services
export const replyService = {
  // Get replies for a review
  getReplies: async (reviewId) => {
    return await apiClient.get(`/reply?review_id=${reviewId}`);
  },

  // Create reply
  createReply: async (reviewId, content) => {
    return await apiClient.post(`/reply?review_id=${reviewId}`, { content });
  },

  // Update reply
  updateReply: async (replyId, content) => {
    return await apiClient.put(`/reply/${replyId}`, { content });
  },

  // Delete reply
  deleteReply: async (replyId) => {
    return await apiClient.delete(`/reply/${replyId}`);
  },
};

