import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { CodeVerify, EmailCode, PhoneCode, PhoneVerify, User } from '../../../models/datamodels';
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
} from '../api';
import { useTokenStorage } from './useTokenStorage';

// Hook for registering a user
export const useRegisterUser = () => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckMail = (userEmail: EmailCode) => {
    navigate('/auth/register/checkemail', { state: userEmail });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
      console.log('User registered:', data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      login(data.tokens.access.token);

      navigateToCheckMail({ email: data.user.email });
    },
    onError: (error) => {
      console.error('Error registering user:', error);
      return 'Error registering user';
    },
  });
};
// Hook for registering a user with google
export const useRegisterUserWithGoogle = () => {
  // const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  // // const navigate = useNavigate();
  // const { login } = useContext(AuthContext);
  return useQuery({
    queryKey: ['registerWithGoogle'],
    queryFn: () => registerWithGoogle(),
    // onSuccess: (data) => {
    //   console.log("User registered:", data);
    //   storeAccessToken(data.tokens.access.token);
    //   storeRefreshToken(data.tokens.refresh.token);
    //   login(data.tokens.access.token);
    // },
    // onError: (error) => {
    //   console.error("Error registering user with google:", error);
    // },
  });
};

// Hook for registering a user with phone number
export const usePhoneRegisterUser = () => {
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const navigateToCheckPhone = (phonecode: PhoneCode) => {
    navigate('/auth/register/checkphone', { state: phonecode });
  };

  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: (data) => {
      console.log('User registered:', data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      login(data.tokens.access.token);

      navigateToCheckPhone({ phone: data.user.phone });
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
  });
};

// Hook for logging in a user
export const useLoginUser = () => {
  const navigate = useNavigate();
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate('/feed');
  };
  return useMutation({
    mutationFn: (user: User) => loginUser(user),
    onSuccess: (data) => {
      console.log('User logged in:', data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
      console.log("expired date", data.tokens.access.expires);
      login(data.tokens.access.token);
      

      navigateToFeed();
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });
};
// Hook for logging in a user
export const useLoginUserWithPhone = () => {
  const navigate = useNavigate();
  const { storeAccessToken, storeRefreshToken } = useTokenStorage();
  const { login } = useContext(AuthContext);

  const navigateToFeed = () => {
    navigate('/feed');
  };
  return useMutation({
    mutationFn: (user: User) => loginUserWithPhone(user),
    onSuccess: (data) => {
      console.log('User logged in:', data);
      storeAccessToken(data.tokens.access.token);
      storeRefreshToken(data.tokens.refresh.token);
       console.log("expired date", data.tokens.access.expires);
      login(data.tokens.access.token);
     

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
