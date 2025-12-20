import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';

export const useCompany = (companyId, enabled = true) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companyService.getCompanyOverview(companyId),
    enabled: enabled && !!companyId,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
  });
};

