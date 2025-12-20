import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export const useReviewMutations = (reviewId, companyId, onSuccessCallback) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => reviewService.likeReview(reviewId),
    onSuccess: (response) => {
      let reviewData = null;
      if (response?.status === 'ok' || response?.status === 'success') {
        if (response.data) {
          if (response.data.review) {
            reviewData = response.data.review;
          } else if (response.data.id) {
            reviewData = response.data;
          }
          
          if (onSuccessCallback && reviewData) {
            onSuccessCallback(reviewId, reviewData);
          }
        }
      }
      
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', companyId] });
      }
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => reviewService.dislikeReview(reviewId),
    onSuccess: (response) => {
      let reviewData = null;
      if (response?.status === 'ok' || response?.status === 'success') {
        if (response.data) {
          if (response.data.review) {
            reviewData = response.data.review;
          } else if (response.data.id) {
            reviewData = response.data;
          }
          
          if (onSuccessCallback && reviewData) {
            onSuccessCallback(reviewId, reviewData);
          }
        }
      }
      
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', companyId] });
      }
    },
  });

  return {
    likeMutation,
    dislikeMutation,
    likeReview: likeMutation.mutate,
    dislikeReview: dislikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isDisliking: dislikeMutation.isPending,
  };
};
