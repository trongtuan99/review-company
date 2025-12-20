const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  const isNgrok = window.location.hostname.includes('ngrok-free.app') || 
                   window.location.hostname.includes('ngrok.io');
  
  if (isNgrok) {
    const backendNgrokUrl = import.meta.env.VITE_API_NGROK_URL;
    if (backendNgrokUrl) {
      return backendNgrokUrl;
    }
    const localIP = import.meta.env.VITE_API_LOCAL_IP;
    if (localIP) {
      return `http://${localIP}:3000/api/v1`;
    }
    return 'http://localhost:3000/api/v1';
  }
  
  return 'http://localhost:3000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_VERSION = 'v1';

export const getHeaders = (token = null, tenant = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-VERSION': API_VERSION,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (tenant) {
    headers['X-API-TENANT'] = tenant;
  }

  return headers;
};

export const DEFAULT_TENANT = 'asia';

