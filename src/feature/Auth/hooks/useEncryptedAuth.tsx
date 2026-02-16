import { useState, useCallback } from 'react';
import {
  encryptAndStoreLoginData,
  decryptLoginData,
  getDecryptedAccessToken,
  getDecryptedRefreshToken,
  getDecryptedUser,

} from '../api/Encryption'; 
import { User,  LoginResponse } from '../../../models/datamodels';
import { STORAGE_KEY } from '../../../constants';

export const useEncryptedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Function to encrypt and store login data, then update state
  const storeLoginData = useCallback((data: LoginResponse) => {
    encryptAndStoreLoginData(data);
    setUser(data.user);
    setAccessToken(data.tokens.access.token);
    setRefreshToken(data.tokens.refresh.token);
  }, []);

  // Function to load and decrypt all data from localStorage
  const loadEncryptedData = useCallback(() => {
    const decryptedData = decryptLoginData();
    if (decryptedData) {
      setUser(decryptedData.user);
      setAccessToken(decryptedData.tokens.access.token);
      setRefreshToken(decryptedData.tokens.refresh.token);
    } else {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  // Function to get just the access token (updates state)
  const fetchAccessToken = useCallback(() => {
    const token = getDecryptedAccessToken();
    setAccessToken(token);
    return token;
  }, []);

  // Function to get just the refresh token (updates state)
  const fetchRefreshToken = useCallback(() => {
    const token = getDecryptedRefreshToken();
    setRefreshToken(token);
    return token;
  }, []);

  // Function to get just the user (updates state)
  const fetchUser = useCallback(() => {
    const userData = getDecryptedUser();
    setUser(userData);
    return userData;
  }, []);

  // Function to clear all encrypted data (e.g., for logout)
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  return {
    user, 
    accessToken, 
    refreshToken, 
    storeLoginData, 
    loadEncryptedData, 
    fetchAccessToken, 
    fetchRefreshToken,
    fetchUser, 
    clearAuthData,
  };
};