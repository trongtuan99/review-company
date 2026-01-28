import axios from 'axios';
import { tokenManager } from './tokenManager';
import { API_BASE_URL, getHeaders, DEFAULT_TENANT } from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    let tenant = tokenManager.getTenant();
    if (!tenant) {
      tenant = DEFAULT_TENANT;
      tokenManager.setTenant(tenant);
    }
    
    config.headers = {
      ...config.headers,
      ...getHeaders(token, tenant),
    };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Check if API returned success: false (backend error response)
    if (response.data && response.data.success === false) {
      return Promise.reject({
        message: response.data.message || 'Có lỗi xảy ra',
        error: 'API Error',
        data: response.data,
      });
    }
    return response.data;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
      const currentURL = error.config?.baseURL || API_BASE_URL;
      const errorMessage = {
        message: `Không thể kết nối đến server.\nURL hiện tại: ${currentURL}\n\nVui lòng kiểm tra:\n- URL API trong file .env (VITE_API_BASE_URL)\n- Ngrok tunnel đang chạy và URL đúng\n- Kết nối mạng của bạn`,
        error: 'Network Error',
        details: `URL: ${currentURL}`,
      };
      return Promise.reject(errorMessage);
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      const errorMessage = {
        message: 'Request timeout. Server không phản hồi. Vui lòng thử lại.',
        error: 'Timeout Error',
      };
      return Promise.reject(errorMessage);
    }
    
    if (error.response?.status === 404) {
      const fullURL = error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown';
      const errorMessage = {
        message: `Endpoint không tìm thấy (404).\nURL: ${fullURL}\n\nVui lòng kiểm tra:\n- Ngrok tunnel đang chạy và URL đúng\n- Rails server đang chạy\n- Route có tồn tại: /api/v1/auth/sign_in`,
        error: 'Not Found',
        status: 404,
        url: fullURL,
      };
      return Promise.reject(errorMessage);
    }
    
    if (error.response?.status === 401) {
      tokenManager.clear();
      // Optionally redirect or handle logout state
      // window.location.href = '/login'; // Navigation might need to be handled differently
    }
    
    return Promise.reject(error.response?.data || {
      message: error.message || 'Đã xảy ra lỗi không xác định',
      error: error.code || 'Unknown Error',
      status: error.response?.status,
    });
  }
);

export default apiClient;

