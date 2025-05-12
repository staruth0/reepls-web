import { apiClient} from "../../../services/apiClient";
import {CodeVerify,EmailCode,PhoneCode,PhoneVerify,User} from "../../../models/datamodels";
import { jwtDecode } from "jwt-decode";
import { getDecryptedAccessToken } from "./Encryption";

// Register user
const registerUser = async (user: User) => {
  const { data } = await apiClient.post("/auth/register", user);
  return data;
};

// Register user
const registerWithGoogle = async () => {
  const { data } = await apiClient.get("/googleAuth/google");
  return data;
};
// Register user
const logOutWithGoogle = async () => {
  const { data } = await apiClient.get("/googleAuth/logout");
  return data;
};

// Register user
const updateUser = async (user: User) => {
  const token = getDecryptedAccessToken();

  if (token) {
    const tokenDecoded = jwtDecode(token);
    const { data } = await apiClient.patch(
      `/users/${tokenDecoded.sub}`,
      user
    );
    return data;
  }
};

// Login user
const loginUser = async (user: User) => {
  const { data } = await apiClient.post("/auth/login-email", user);
  return data;
};
const loginUserWithPhone = async (user: User) => {
  const { data } = await apiClient.post("/auth/login-phone", user);
  return data;
};

// Get email verification code
const getEmailVerificationCode = async (user: EmailCode) => {
  const { data } = await apiClient.post(
    "/auth/send-verification-email",
    user
  );
  return data;
};

// Verify email code
const verifyEmailCode = async (user: CodeVerify) => {
  const { data } = await apiClient.post("/auth/verify-email", user);
  return data;
};

// Get phone verification code
const getPhoneVerificationCode = async (user: PhoneCode) => {
  const { data } = await apiClient.post(
    "/auth/send-verification-sms",
    user
  );
  return data;
};

// Verify phone code
const verifyPhoneCode = async (user: PhoneVerify) => {
  const { data } = await apiClient.post("/auth/verify-phone", user);
  return data;
};

// Logout user
const logoutUser = async (refreshToken: string) => {
  const { data } = await apiClient.post("/auth/logout", {
    refreshToken,
  });
  return data;
};

// Refresh tokens
const refreshAuthTokens = async (refreshToken: string) => {
  const { data } = await apiClient.post("/auth/refresh-tokens", {
    refreshToken,
  });
  return data;
};

// Forgot password - send reset password email
const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post("/auth/forgot-password", {
    email,
  });
  return data;
};

// Verify reset password code
const verifyResetPasswordCode = async (code: string, email: string) => {
  const { data } = await apiClient.post(
    "/auth/reset-password-code-verify",
    { code, email }
  );
  return data;
};

// Reset password
const resetPassword = async (
  token: string,
  email: string,
  password: string
) => {
  const { data } = await apiClient.post(
    `/auth/reset-password?token=${token}`,
    { email, password }
  );
  return data;
};

export {
  registerUser,
  registerWithGoogle,
  loginUser,
  getEmailVerificationCode,
  verifyEmailCode,
  getPhoneVerificationCode,
  verifyPhoneCode,
  logoutUser,
  refreshAuthTokens,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  updateUser,
  loginUserWithPhone,
  logOutWithGoogle
};
