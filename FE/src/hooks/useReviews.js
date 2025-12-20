import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export const useReviews = (companyId, enabled = true) => {
  return useQuery({
    queryKey: ['reviews', companyId],
    queryFn: () => reviewService.getReviews(companyId),
    enabled: enabled && !!companyId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

