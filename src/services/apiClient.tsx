import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '../constants';
import { refreshAuthTokens } from '../feature/Auth/api/index';
const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.url?.includes('/login') && !config.url?.includes('/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          console.log('Refreshing token');
          const data = await refreshAuthTokens(refreshToken);
          if (!data.accessToken) throw new Error('No access token received');

          localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

          // Update headers before retrying the request
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          console.log('Token refresh failed:', e);
          toast.info('Please login again', {
            autoClose: 3000,
          });
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          window.location.href = '/auth/login/phone';
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };
