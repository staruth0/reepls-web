import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { API_URL, STORAGE_KEY } from '../constants';
import {
  decryptLoginData,
  encryptAndStoreLoginData,
  getDecryptedAccessToken,
  getDecryptedRefreshToken,
} from '../feature/Auth/api/Encryption';
import { refreshAuthTokens } from '../feature/Auth/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getDecryptedAccessToken(); // Use the decrypted access token

    console.log('Testing token availability:', token);
    if (token && !config.url?.includes('/login') && !config.url?.includes('/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

      const refreshToken = getDecryptedRefreshToken(); // Use the decrypted refresh token
      if (refreshToken) {
        try {
          console.log('Refreshing token');
          const data = await refreshAuthTokens(refreshToken);
          if (!data.accessToken) throw new Error('No access token received');

          // Decrypt the existing login data to update it
          const decryptedData = decryptLoginData();
          if (!decryptedData) throw new Error('No login data found');

          // Update the tokens in the decrypted data
          decryptedData.tokens.access.token = data.accessToken;
          decryptedData.tokens.refresh.token = data.refreshToken;

          // Re-encrypt and store the updated login data
          encryptAndStoreLoginData(decryptedData);

          // Update headers before retrying the request
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          console.log('Token refresh failed:', e);
          toast.info('Please login again', {
            autoClose: 3000,
          });

          // Clear the encrypted login data on token refresh failure
          localStorage.removeItem(STORAGE_KEY);

          window.location.href = '/auth/login/phone';
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(error);
    
  }
);

export { apiClient };
