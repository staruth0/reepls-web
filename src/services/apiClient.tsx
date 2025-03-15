import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../constants'; 
import { refreshAuthTokens } from '../feature/Auth/api/index'; 
import { getDecryptedAccessToken, getDecryptedRefreshToken } from '../feature/Auth/api/Encryption';


const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header with decrypted access token
apiClient.interceptors.request.use(
  (config) => {
    const token = getDecryptedAccessToken(); 

    console.log('Testing token availability:', token);
    if (
      token &&
      !config.url?.includes('/login') &&
      !config.url?.includes('/register')
    ) {
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
    console.log('Error details:', error.response, error.message);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getDecryptedRefreshToken(); 
      if (refreshToken) {
        try {
          console.log('Refreshing token');
          const data = await refreshAuthTokens(refreshToken);
          if (!data.accessToken) throw new Error('No access token received');

          // Since we're using encrypted storage, we need to update the full LoginResponse
        
          const updatedLoginData = {
            user: null, 
            tokens: {
              access: { token: data.accessToken },
              refresh: { token: data.refreshToken}, 
            },
          };
          
          console.log('Updated tokens:', updatedLoginData);

          // Update headers before retrying the request
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          console.log('Token refresh failed:', e);
          toast.info('Please login again', {
            autoClose: 3000,
          });
          localStorage.removeItem('encryptedLoginData');
          window.location.href = '/auth/login/phone';
          return Promise.reject(e);
        }
      } 
    }
    return Promise.reject(error);
  }
);

export { apiClient };