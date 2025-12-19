import apiClient from './api';

// Company Services
export const companyService = {
  // Get list of companies
  getCompanies: async (searchQuery = null) => {
    const url = searchQuery ? `/company?q=${encodeURIComponent(searchQuery)}` : '/company';
    return await apiClient.get(url);
  },

  // Search companies by name
  searchCompanies: async (query) => {
    return await apiClient.get(`/company?q=${encodeURIComponent(query)}`);
  },

  // Get company details
  getCompanyOverview: async (companyId) => {
    return await apiClient.get(`/company/${companyId}/company_overview`);
  },

  // Create company (Admin/Owner only)
  createCompany: async (companyData) => {
    return await apiClient.post('/company', { company: companyData });
  },

  // Update company (Admin/Owner only)
  updateCompany: async (companyId, companyData) => {
    return await apiClient.put(`/company/${companyId}`, { company: companyData });
  },

  // Delete company (Soft delete - Admin/Owner only)
  deleteCompany: async (companyId) => {
    return await apiClient.put(`/company/${companyId}/delete_company`);
  },
};

