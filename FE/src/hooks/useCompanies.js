import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';

export const useCompanies = (options = {}) => {
  const { searchQuery, page, perPage, enabled = true } = options;

  return useQuery({
    queryKey: ['companies', searchQuery, page, perPage],
    queryFn: () => companyService.getCompanies(searchQuery, { page, perPage }),
    enabled,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTopRatedCompanies = (enabled = true) => {
  return useQuery({
    queryKey: ['companies', 'top-rated'],
    queryFn: () => companyService.getTopRatedCompanies(),
    enabled,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRemainingCompanies = (excludeIds = [], limit = 20, enabled = true) => {
  return useQuery({
    queryKey: ['companies', 'remaining', excludeIds.join(','), limit],
    queryFn: () => companyService.getRemainingCompanies(excludeIds, { limit }),
    enabled: enabled && excludeIds.length > 0,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

