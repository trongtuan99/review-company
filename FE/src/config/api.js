// API Configuration
// Auto-detect if running through ngrok and use appropriate API URL
const getApiBaseUrl = () => {
  // If explicitly set in .env, use that
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if running through ngrok (frontend accessed via ngrok)
  const isNgrok = window.location.hostname.includes('ngrok-free.app') || 
                   window.location.hostname.includes('ngrok.io');
  
  if (isNgrok) {
    // If frontend is accessed via ngrok, we need backend ngrok URL too
    // Default: use the backend ngrok domain if available
    const backendNgrokUrl = import.meta.env.VITE_API_NGROK_URL;
    if (backendNgrokUrl) {
      return backendNgrokUrl;
    }
    // Fallback: try to construct from current hostname (if same domain)
    // Or use local IP (for same network access)
    const localIP = import.meta.env.VITE_API_LOCAL_IP;
    if (localIP) {
      return `http://${localIP}:3000/api/v1`;
    }
    // Last resort: warn user they need to configure
    console.warn('Frontend accessed via ngrok but no backend ngrok URL configured. Please set VITE_API_NGROK_URL in .env');
    return 'http://localhost:3000/api/v1'; // Will fail but at least shows error
  }
  
  // Normal localhost access
  return 'http://localhost:3000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_VERSION = 'v1';

// API Headers
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

// Default tenant (có thể lấy từ user selection hoặc config)
export const DEFAULT_TENANT = 'asia';

