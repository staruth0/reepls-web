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
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckMail = (userEmail: EmailCode) => {
    navigate('/auth/register/checkemail', { state: userEmail });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data: LoginResponse) => {
      console.log('User registered:', data);
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToCheckMail({ email: data.user.email! });
    },
    onError: (error) => {
      console.error('Error registering user:', error);
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
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckPhone = (phonecode: PhoneCode) => {
    navigate('/auth/register/checkphone', { state: phonecode });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data: LoginResponse) => {
      console.log('User registered:', data);
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToCheckPhone({ phone: data.user.phone! });
    },
    onError: (error) => {
      console.error('Error registering user:', error);
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
      console.log('User logged in:', data);
      console.log('Expired date:', data.tokens.access.expires);
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToFeed();
    },
    onError: (error) => {
      console.error('Error logging in:', error);
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
      console.log('User logged in:', data);
      console.log('Expired date:', data.tokens.access.expires);
      login(data); // Pass the full LoginResponse to encrypt and store
      navigateToFeed();
    },
    onError: (error) => {
      console.error('Error logging in:', error);
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
    onSuccess: (data) => {
      console.log('User updated successfully:', data);
      navigateToUserProfile();
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });
};

// Hook for getting email verification code
export const useGetEmailCode = () => {
  return useMutation({
    mutationFn: (emailCode: EmailCode) => getEmailVerificationCode(emailCode),
    onSuccess: (data) => {
      console.log('Email verification code sent:', data);
    },
    onError: (error) => {
      console.error('Error getting email code:', error);
    },
  });
};

// Hook for verifying email code
export const useVerifyEmailCode = () => {
  //   const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();

  const navigateToName = () => {
    navigate('/auth/register/email/two');
  };

  return useMutation({
    mutationFn: (codeVerify: CodeVerify) => verifyEmailCode(codeVerify),
    onSuccess: (data) => {
      console.log('Email code verified:', data);

      navigateToName();
    },
    onError: (error) => {
      console.error('Error verifying email code:', error);
    },
  });
};

// Hook for getting phone verification code
export const useGetPhoneCode = () => {
  return useMutation({
    mutationFn: (phoneCode: PhoneCode) => getPhoneVerificationCode(phoneCode),
    onSuccess: (data) => {
      console.log('Phone verification code sent:', data);
    },
    onError: (error) => {
      console.error('Error getting phone code:', error);
    },
  });
};

// Hook for verifying phone code
export const useVerifyPhoneCode = () => {
  const navigate = useNavigate();

  const navigateToName = () => {
    navigate('/auth/register/phone/two');
  };
  return useMutation({
    mutationFn: (phoneVerify: PhoneVerify) => verifyPhoneCode(phoneVerify),
    onSuccess: (data) => {
      console.log('Phone code verified:', data);
      navigateToName();
    },
    onError: (error) => {
      console.error('Error verifying phone code:', error);
    },
  });
};

// Hook for refrehing the token
export const useRefreshToken = () => {
  const { getRefreshToken } = useTokenStorage();

  return useMutation({
    mutationFn: () => refreshAuthTokens(getRefreshToken()!),
    onSuccess: (data) => {
      console.log('Token refreshed:', data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};


// Hook for logging out a user
export const useLogoutUser = (token: string) => {
  return useMutation({
    mutationFn: () => logoutUser(token), 
    onError: (error) => {
      console.error("Error logging out:", error); 
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