import { jwtDecode } from 'jwt-decode';
import { AUTH_TOKEN_KEY } from '../../../constants';
import { CodeVerify, EmailCode, PhoneCode, PhoneVerify, User } from '../../../models/datamodels';
import { apiClient } from '../../../services/apiClient';

// Register user
const registerUser = async (user: User) => {
  console.log('second', user);
  const { data } = await apiClient.post('/auth/register', user);
  return data;
};

// Register user
const updateUser = async (user: User) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    const tokenDecoded = jwtDecode(token);
    console.log('second', tokenDecoded.sub, user);
    const { data } = await apiClient.patch(`/users/${tokenDecoded.sub}`, user);
    return data;
  }
};

// Login user
const loginUser = async (user: User) => {
  console.log(user);
  const { data } = await apiClient.post('/auth/login-email', user);
  return data;
};

// Get email verification code
const getEmailVerificationCode = async (user: EmailCode) => {
  console.log(user);
  const { data } = await apiClient.post('/auth/send-verification-email', user);
  return data;
};

// Verify email code
const verifyEmailCode = async (user: CodeVerify) => {
  console.log(user);
  const { data } = await apiClient.post('/auth/verify-email', user);
  return data;
};

// Get phone verification code
const getPhoneVerificationCode = async (user: PhoneCode) => {
  console.log(user);
  const { data } = await apiClient.post('/auth/send-verification-sms', user);
  return data;
};

// Verify phone code
const verifyPhoneCode = async (user: PhoneVerify) => {
  console.log(user);
  const { data } = await apiClient.post('/auth/verify-phone', user);
  return data;
};

// Logout user
const logoutUser = async (refreshToken: string) => {
  const { data } = await apiClient.post('/auth/logout', {
    refreshToken,
  });
  return data;
};

// Refresh tokens
const refreshAuthTokens = async (refreshToken: string) => {
  const { data } = await apiClient.post('/auth/refresh-tokens', {
    refreshToken,
  });
  return data;
};

// Forgot password - send reset password email
const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post('/auth/forgot-password', {
    email,
  });
  return data;
};

// Verify reset password code
const verifyResetPasswordCode = async (code: string, email: string) => {
  const { data } = await apiClient.post('/auth/reset-password-code-verify', { code, email });
  return data;
};

// Reset password
const resetPassword = async (token: string, email: string, password: string) => {
  const { data } = await apiClient.post(`/auth/reset-password?token=${token}`, { email, password });
  return data;
};

export {
  forgotPassword,
  getEmailVerificationCode,
  getPhoneVerificationCode,
  loginUser,
  logoutUser,
  refreshAuthTokens,
  registerUser,
  resetPassword,
  updateUser,
  verifyEmailCode,
  verifyPhoneCode,
  verifyResetPasswordCode,
};
