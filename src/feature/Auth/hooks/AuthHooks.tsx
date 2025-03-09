import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  getEmailVerificationCode,
  verifyEmailCode,
  getPhoneVerificationCode,
  verifyPhoneCode,
  updateUser,
  refreshAuthTokens,
} from "../api";
import {
  User,
  EmailCode,
  PhoneCode,
  CodeVerify,
  PhoneVerify,
} from "../../../models/datamodels";
import { useTokenStorage } from "./useTokenStorage";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext/authContext";
import { toast } from "react-toastify";

// Hook for registering a user
export const useRegisterUser = () => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckMail = (userEmail: EmailCode) => {
    navigate("/auth/register/checkemail", { state: userEmail });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
      console.log("User registered:", data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      login(data.tokens.access.token);

      navigateToCheckMail({ email: data.user.email });
      toast.success("Registration successful! Please check your email.", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error registering user. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error registering user:", error);
    },
  });
};

// Hook for registering a user with phone number
export const usePhoneRegisterUser = () => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckPhone = (phonecode: PhoneCode) => {
    navigate("/auth/register/checkphone", { state: phonecode });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
      console.log("User registered:", data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      login(data.tokens.access.token);

      navigateToCheckPhone({ phone: data.user.phone });
      toast.success("Registration successful! Please check your phone.", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error registering user. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error registering user:", error);
    },
  });
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate("/feed");
  };

  return useMutation({
    mutationFn: (user: User) => loginUser(user),
    onSuccess: (data) => {
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      login(data.tokens.access.token);

      navigateToFeed();
      toast.success("Login successful!", { position: "top-right" });
    },
    onError: (error: any) => {
      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            errorMessage = data?.message || "Invalid request. Please check your details.";
            break;
          case 401:
            errorMessage = "Incorrect email or password. Please try again.";
            break;
          case 403:
            errorMessage = "Your account is not authorized. Please contact support.";
            break;
          case 404:
            errorMessage = "User not found. Please check your email and try again.";
            break;
          case 500:
            errorMessage = "Server error! Please try again later.";
            break;
          default:
            errorMessage = "Unexpected error. Please try again.";
        }
      } else if (error?.message?.includes("Network Error")) {
        errorMessage = "Network error! Please check your internet connection.";
      }

      toast.error(errorMessage, { position: "top-right" });
      console.error("Error logging in:", error);
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate("/feed");
  };

  return useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      navigateToUserProfile();
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });
};

// Hook for getting email verification code
export const useGetEmailCode = () => {
  return useMutation({
    mutationFn: (emailCode: EmailCode) => getEmailVerificationCode(emailCode),
    onSuccess: (data) => {
      console.log("Email verification code sent:", data);
      toast.success("Verification code sent to your email.", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error sending verification code. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error getting email code:", error);
    },
  });
};

// Hook for verifying email code
export const useVerifyEmailCode = () => {
  const navigate = useNavigate();

  const navigateToName = () => {
    navigate("/auth/register/email/two");
  };

  return useMutation({
    mutationFn: (codeVerify: CodeVerify) => verifyEmailCode(codeVerify),
    onSuccess: (data) => {
      console.log("Email code verified:", data);
      navigateToName();
      toast.success("Email verified successfully!", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error verifying email code. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error verifying email code:", error);
    },
  });
};

// Hook for getting phone verification code
export const useGetPhoneCode = () => {
  return useMutation({
    mutationFn: (phoneCode: PhoneCode) => getPhoneVerificationCode(phoneCode),
    onSuccess: (data) => {
      console.log("Phone verification code sent:", data);
      toast.success("Verification code sent to your phone.", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error sending verification code. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error getting phone code:", error);
    },
  });
};

// Hook for verifying phone code
export const useVerifyPhoneCode = () => {
  const navigate = useNavigate();

  const navigateToName = () => {
    navigate("/auth/register/phone/two");
  };
  return useMutation({
    mutationFn: (phoneVerify: PhoneVerify) => verifyPhoneCode(phoneVerify),
    onSuccess: (data) => {
      console.log("Phone code verified:", data);
      navigateToName();
      toast.success("Phone verified successfully!", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error verifying phone code. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error verifying phone code:", error);
    },
  });
};

// Hook for refreshing the token
export const useRefreshToken = () => {
  const { getRefreshToken } = useTokenStorage();

  return useMutation({
    mutationFn: () => refreshAuthTokens(getRefreshToken()!),
    onSuccess: (data) => {
      console.log("Token refreshed:", data);
    },
    onError: (error: any) => {
      console.error("Error refreshing token:", error);
    },
  });
};