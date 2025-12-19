import axios from 'axios';
import { API_BASE_URL, getHeaders, DEFAULT_TENANT } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - Add token and tenant to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // Always use DEFAULT_TENANT if tenant not set in localStorage
    // This ensures tenant header is always sent
    let tenant = localStorage.getItem('tenant');
    if (!tenant) {
      tenant = DEFAULT_TENANT;
      localStorage.setItem('tenant', tenant);
    }
    
    config.headers = {
      ...config.headers,
      ...getHeaders(token, tenant),
    };
    
    // Debug log
    const fullURL = `${config.baseURL}${config.url}`;
    console.log('API Request:', {
      baseURL: config.baseURL,
      url: config.url,
      fullURL: fullURL,
      method: config.method,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug log
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Network error (connection failed, wrong URL, etc.)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ERR_CONNECTION_REFUSED') {
      const currentURL = error.config?.baseURL || API_BASE_URL;
      const errorMessage = {
        message: `Không thể kết nối đến server.\nURL hiện tại: ${currentURL}\n\nVui lòng kiểm tra:\n- URL API trong file .env (VITE_API_BASE_URL)\n- Ngrok tunnel đang chạy và URL đúng\n- Kết nối mạng của bạn`,
        error: 'Network Error',
        details: `URL: ${currentURL}`,
      };
      console.error('Network Error Details:', errorMessage);
      return Promise.reject(errorMessage);
    }
    
    // Request timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      const errorMessage = {
        message: 'Request timeout. Server không phản hồi. Vui lòng thử lại.',
        error: 'Timeout Error',
      };
      return Promise.reject(errorMessage);
    }
    
    // 404 Not Found
    if (error.response?.status === 404) {
      const fullURL = error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown';
      const errorMessage = {
        message: `Endpoint không tìm thấy (404).\nURL: ${fullURL}\n\nVui lòng kiểm tra:\n- Ngrok tunnel đang chạy và URL đúng\n- Rails server đang chạy\n- Route có tồn tại: /api/v1/auth/sign_in`,
        error: 'Not Found',
        status: 404,
        url: fullURL,
      };
      console.error('404 Error Details:', errorMessage);
      return Promise.reject(errorMessage);
    }
    
    // Unauthorized
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Other errors
    return Promise.reject(error.response?.data || {
      message: error.message || 'Đã xảy ra lỗi không xác định',
      error: error.code || 'Unknown Error',
      status: error.response?.status,
    });
  }
);

export default apiClient;

