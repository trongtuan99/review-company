import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';

export const useFavoriteMutations = () => {
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: (companyId) => favoriteService.addFavorite(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-status'] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (companyId) => favoriteService.removeFavorite(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-status'] });
    },
  });

  return {
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAdding: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending,
    addFavoriteAsync: addFavoriteMutation.mutateAsync,
    removeFavoriteAsync: removeFavoriteMutation.mutateAsync,
  };
};

