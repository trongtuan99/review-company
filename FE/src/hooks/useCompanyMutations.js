import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/companyService';

export const useCompanyMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (companyData) => companyService.createCompany(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'top-rated'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'remaining'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ companyId, companyData }) => 
      companyService.updateCompany(companyId, companyData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (companyId) => companyService.deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'top-rated'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'remaining'] });
    },
  });

  return {
    createCompany: createMutation.mutate,
    updateCompany: updateMutation.mutate,
    deleteCompany: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createCompanyAsync: createMutation.mutateAsync,
    updateCompanyAsync: updateMutation.mutateAsync,
    deleteCompanyAsync: deleteMutation.mutateAsync,
  };
};

