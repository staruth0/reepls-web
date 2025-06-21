import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { CodeVerify, EmailCode, LoginResponse, PhoneCode, PhoneVerify, User } from '../../../models/datamodels';
import {
  getEmailVerificationCode,
  getPhoneVerificationCode,
  loginUser,
  loginUserWithPhone,
  refreshAuthTokens,
  registerUser,
  registerWithGoogle,
  updateUser,
  verifyEmailCode,
  verifyPhoneCode,
  logoutUser,
  logOutWithGoogle,
} from "../api";
import { useTokenStorage } from './useTokenStorage';


// Hook for registering a user with email
export const useRegisterUser = () => {
  const { login } = useContext(AuthContext);


  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data: LoginResponse) => {
      login(data); // Pass the full LoginResponse to encrypt and store
    },
    onError: (error) => {
      void error;
      return 'Error registering user';
    },
  });
};

// Hook for registering a user with Google
export const useRegisterUserWithGoogle = () => {

  return useQuery({
    queryKey: ['registerWithGoogle'],
    queryFn: () => registerWithGoogle(),
  
  });
};
// Hook for registering a user with Google
export const useLogOutUserWithGoogle = () => {

  return useQuery({
    queryKey: ['registerWithGoogle'],
    queryFn: () => logOutWithGoogle(),
  
  });
};

// Hook for registering a user with phone number
export const usePhoneRegisterUser = () => {
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data: LoginResponse) => {
      login(data); // Pass the full LoginResponse to encrypt and store
    },
    onError: (error) => {
      void error;
    },
  });
};

// Hook for logging in a user with email
export const useLoginUser = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate('/feed');
  };

  return useMutation({
    mutationFn: (user: User) => loginUser(user),
    onSuccess: (data: LoginResponse) => {
      
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToFeed();
    },
    onError: (error) => {
     void error;
    },
  });
};

// Hook for logging in a user with phone
export const useLoginUserWithPhone = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate('/feed');
  };

  return useMutation({
    mutationFn: (user: User) => loginUserWithPhone(user),
    onSuccess: (data: LoginResponse) => {
      
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToFeed();
    },
    onError: (error) => {
      void error;
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    navigate('/feed');
  };

  return useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: () => {
      navigateToUserProfile();
    },
    onError: (error) => {
      void error;
    },
  });
};

// Hook for getting email verification code
export const useGetEmailCode = () => {
  return useMutation({
    mutationFn: (emailCode: EmailCode) => getEmailVerificationCode(emailCode),
    onError: (error) => {
      void error;
    },
  });
};

// Hook for verifying email code
export const useVerifyEmailCode = () => {
  //   const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  return useMutation({
    mutationFn: (codeVerify: CodeVerify) => verifyEmailCode(codeVerify),
    onError: (error) => {
      void error;
    },
  });
};

// Hook for getting phone verification code
export const useGetPhoneCode = () => {
  return useMutation({
    mutationFn: (phoneCode: PhoneCode) => getPhoneVerificationCode(phoneCode),
   
    onError: (error) => {
      void error;
    },
  });
};

// Hook for verifying phone code
export const useVerifyPhoneCode = () => {

  return useMutation({
    mutationFn: (phoneVerify: PhoneVerify) => verifyPhoneCode(phoneVerify),
    onError: (error) => {
      void error;
    },
  });
};

// Hook for refrehing the token
export const useRefreshToken = () => {
  const { getRefreshToken } = useTokenStorage();

  return useMutation({
    mutationFn: () => refreshAuthTokens(getRefreshToken()!),
    onSuccess: () => {
    },
    onError: (error) => {
     void error;
    },
  });
};


// Hook for logging out a user
export const useLogoutUser = (token: string) => {
  return useMutation({
    mutationFn: () => logoutUser(token), 
    onError: (error) => {
      void error;
    },
  });
};

// // Hook for sending a forgot password email
// export const useForgotPassword = () => {

//   return useMutation({
//     mutationFn: (email: string) => forgotPassword(email),
//   });
// };

// // Hook for verifying reset password code
// export const useVerifyResetPasswordCode = () => {
//   const navigate = useNavigate();

//   const navigateToResetPassword = (email: string) => {
//     navigate('/auth/reset-password/new', { state: { email } }); 
//   };

//   return useMutation({
//     mutationFn: ({ code, email }: { code: string; email: string }) => 
//       verifyResetPasswordCode(code, email),
  
//   });
// };

// // Hook for resetting the password
// export const useResetPassword = () => {

//   return useMutation({
//     mutationFn: ({ token, email, password }: { token: string; email: string; password: string }) => 
//       resetPassword(token, email, password),

//   });
// };