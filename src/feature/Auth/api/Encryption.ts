import CryptoJS from 'crypto-js';
import { User,LoginResponse } from '../../../models/datamodels';
import { STORAGE_KEY } from '../../../constants';


const SECRET_KEY = 'Thiago+123456789-987654321';



// 1. Encrypt and store the entire login response
export const encryptAndStoreLoginData = (data: LoginResponse): void => {
  try {
    const dataString = JSON.stringify(data); // Convert object to string
    const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Error encrypting login data:', error);
  }
};

// 2. Retrieve and decrypt the entire login response
export const decryptLoginData = (): LoginResponse | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) {
      console.warn('No encrypted login data found in localStorage');
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error('Decryption failed - invalid data or key');
    }
    const decryptedData: LoginResponse = JSON.parse(decryptedString);
    return decryptedData;
  } catch (error) {
    console.error('Error decrypting login data:', error);
    return null;
  }
};

// 3. Decrypt and return only the access token
export const getDecryptedAccessToken = (): string | null => {
  const decryptedData = decryptLoginData();
  if (decryptedData && decryptedData.tokens.access.token) {
    return decryptedData.tokens.access.token;
  }
  console.warn('No access token found in decrypted data');
  return null;
};

// 4. Decrypt and return only the refresh token
export const getDecryptedRefreshToken = (): string | null => {
  const decryptedData = decryptLoginData();
  if (decryptedData && decryptedData.tokens.refresh.token) {
    return decryptedData.tokens.refresh.token;
  }
  console.warn('No refresh token found in decrypted data');
  return null;
};

// 5. Decrypt and return only the user object


export const getDecryptedUser = (): User | null => {
  const decryptedData = decryptLoginData();
  if (decryptedData && decryptedData.user) {
    return decryptedData.user;
  }
  console.warn('No user data found in decrypted data');
  return null;
};



/**
 * Updates the username in the encrypted LoginResponse stored in localStorage.
 * @param newUsername - The new username to set.
 * @returns boolean - True if successful, false otherwise.
 */
export const updateUsernameInStorage = (newUsername: string): boolean => {
  try {
    // 1. Retrieve and decrypt the current login data
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (!encryptedData) {
      console.error('No login data found in localStorage');
      return false;
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error('Decryption failed (invalid key or data)');
    }

    const loginData: LoginResponse = JSON.parse(decryptedString);

    // 2. Update the username in the decrypted data
    if (!loginData.user) {
      throw new Error('User data not found in login response');
    }

    const updatedUser: User = {
      ...loginData.user,
      username: newUsername, // Override the username
    };

    const updatedLoginData: LoginResponse = {
      ...loginData,
      user: updatedUser,
    };

    // 3. Re-encrypt and save back to localStorage
    const updatedDataString = JSON.stringify(updatedLoginData);
    const reEncrypted = CryptoJS.AES.encrypt(updatedDataString, SECRET_KEY).toString();
    localStorage.setItem(STORAGE_KEY, reEncrypted);

    return true; // Success
  } catch (error) {
    console.error('Failed to update username:', error);
    return false; // Failure
  }
};