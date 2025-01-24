import { useMutation } from "@tanstack/react-query";
import {registerUser,loginUser,getEmailVerificationCode,verifyEmailCode,getPhoneVerificationCode,verifyPhoneCode,updateUser,refreshAuthTokens} from "../api";
import { User,EmailCode,PhoneCode,CodeVerify,PhoneVerify,} from "../../../models/datamodels";
import { useTokenStorage } from "./useTokenStorage";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext/authContext";

// Hook for registering a user
export const useRegisterUser = (): {
  mutate: (user: User) => void;
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
} => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckMail = (userEmail: EmailCode) => {
    navigate("/auth/register/checkemail", { state: userEmail });
  };

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: (user: User) => registerUser(user), // Ensure registerUser returns a Promise
    onSuccess: (data) => {
      if (data.tokens?.access?.token) {
        console.log("User registered:", data);
        storeAccessToken(data.tokens.access.token);
        storeRefreshToken(data.tokens.refresh.token);
        login(data.tokens.access.token);
      } else {
        console.warn("No tokens received upon registration.");
      }
      navigateToCheckMail({ email: data.user.email });
    },
    onError: (error) => {
      console.error("Error registering user:", error);
    },
  });

  return { mutate, isPending, error, isError, isSuccess };
};

// Hook for registering a user with a phone number
export const usePhoneRegisterUser = (): {
  mutate: (user: User) => void;
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
} => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckPhone = (phoneCode: PhoneCode) => {
    navigate("/auth/register/checkphone", { state: phoneCode });
  };

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
      if (data.tokens?.access?.token) {
        console.log("User registered:", data);
        storeAccessToken(data.tokens.access.token);
        storeRefreshToken(data.tokens.refresh.token);
        login(data.tokens.access.token);
      } else {
        console.warn("No tokens received upon phone registration.");
      }
      navigateToCheckPhone({ phone: data.user.phone });
    },
    onError: (error) => {
      console.error("Error registering user:", error);
    },
  });

  return { mutate, isPending, error, isError, isSuccess };
};

// Hook for logging in a user
export const useLoginUser = (): {
  mutate: (user: User) => void;
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
} => {
  const navigate = useNavigate();
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate("/feed");
  };

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: (user: User) => loginUser(user),
    onSuccess: (data) => {
      if (data.tokens?.access?.token) {
        console.log("User logged in:", data);
        storeAccessToken(data.tokens.access.token);
        storeRefreshToken(data.tokens.refresh.token);
        login(data.tokens.access.token);
        navigateToFeed();
      } else {
        console.warn("No tokens received upon login.");
      }
    },
    onError: (error) => {
      console.error("Error logging in:", error);
    },
  });

  return { mutate, isPending, error, isError, isSuccess };
};


// Hook for updating a user
export const useUpdateUser = (): {
  mutate: (user: User) => void;
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
} => {
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate("/feed");
  };

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      navigateToUserProfile();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  return { mutate, isPending, error, isError, isSuccess };
};

// Hook for getting email verification code
export const useGetEmailCode = () => {
  return useMutation({
    mutationFn: (emailCode: EmailCode) => getEmailVerificationCode(emailCode),
    onSuccess: (data) => {
      console.log("Email verification code sent:", data);
    },
    onError: (error) => {
      console.error("Error getting email code:", error);
    },
  });
};

// Hook for verifying email code
export const useVerifyEmailCode = () => {
  //   const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();

  const navigateToName = () => {
    navigate("/auth/register/email/two");
  };

  return useMutation({
    mutationFn: (codeVerify: CodeVerify) => verifyEmailCode(codeVerify),
    onSuccess: (data) => {
      console.log("Email code verified:", data);

      navigateToName();
    },
    onError: (error) => {
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
    },
    onError: (error) => {
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
    },
    onError: (error) => {
      console.error("Error verifying phone code:", error);
    },
  });
};

// Hook for refrehing the token
export const useRefreshToken = () => {
  const { getRefreshToken } = useTokenStorage();

  return useMutation({
    mutationFn: () => refreshAuthTokens(getRefreshToken()!),
    onSuccess: (data) => {
      console.log("Token refreshed:", data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
