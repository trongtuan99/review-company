import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';

export const useFavorites = (enabled = true) => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.getFavorites(),
    enabled,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useFavoriteStatus = (companyId, enabled = true) => {
  return useQuery({
    queryKey: ['favorite-status', companyId],
    queryFn: () => favoriteService.checkFavorite(companyId),
    enabled: enabled && !!companyId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

