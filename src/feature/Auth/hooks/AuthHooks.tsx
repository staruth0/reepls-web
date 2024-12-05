import { useMutation } from "@tanstack/react-query";
import { registerUser,loginUser,getEmailVerificationCode,verifyEmailCode,getPhoneVerificationCode,verifyPhoneCode, updateUser} from "../api";
import { User,EmailCode,PhoneCode,CodeVerify,PhoneVerify} from "../../../models/datamodels";
import { useTokenStorage } from "./useTokenStorage";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";


// Hook for registering a user
export const useRegisterUser = () => {
    const { storeAccessToken, storeRefreshToken } = useTokenStorage();
    const navigate = useNavigate()
    const { setIsAuthenticated } = useContext(AuthContext);
    
     const navigateToCheckMail = (userEmail: EmailCode) => {
       navigate("/auth/register/checkemail", { state: userEmail });
    };
    
  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
        console.log("User registered:", data);
        storeAccessToken(data.tokens.access.token);
        storeRefreshToken(data.tokens.refresh.token);

        localStorage.setItem('user_id', data.user.id);
        setIsAuthenticated(true);
        navigateToCheckMail({ email: data.user.email });
        
    },
    onError: (error) => {
      console.error("Error registering user:", error);
    },
  });
};

// Hook for logging in a user
export const useLoginUser = () => {
    const navigate = useNavigate();
     const { storeAccessToken, storeRefreshToken } = useTokenStorage();
     const { setIsAuthenticated } = useContext(AuthContext);

    const navigateToFeed = () => {
        navigate('/feed')
    }
  return useMutation({
    mutationFn: (user: User) => loginUser(user),
    onSuccess: (data) => {
        console.log("User logged in:", data);
         storeAccessToken(data.tokens.access.token);
         storeRefreshToken(data.tokens.refresh.token);

         localStorage.setItem("user_id", data.user.id);
         setIsAuthenticated(true);

        navigateToFeed()
    },
    onError: (error) => {
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
    onError: (error) => {
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
        
        navigateToName()
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
  return useMutation({
    mutationFn: (phoneVerify: PhoneVerify) => verifyPhoneCode(phoneVerify),
    onSuccess: (data) => {
      console.log("Phone code verified:", data);
    },
    onError: (error) => {
      console.error("Error verifying phone code:", error);
    },
  });
};
