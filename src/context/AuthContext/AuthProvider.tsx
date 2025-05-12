import React, { ReactNode, useEffect } from 'react';
import { AuthContext, AuthContextProps } from './authContext';
import { LoginResponse, User } from '../../models/datamodels';
import { useEncryptedAuth } from '../../feature/Auth/hooks/useEncryptedAuth';


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { storeLoginData, fetchUser, clearAuthData } = useEncryptedAuth();

  // Initialize user state
  const [user, setUser] = React.useState<User | null>(() => {
    return fetchUser(); 
  });

  
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
    const decryptedUser = fetchUser();
    return !!decryptedUser; 
  });

  // Login function: Encrypts login data and updates state
  const login = (loginData: LoginResponse) => {
    try {
      storeLoginData(loginData); 
      setUser(loginData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Logout function: Clears encrypted data and resets state
  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Log state changes for debugging
  useEffect(() => {
  }, [user, isLoggedIn]);

  const value: AuthContextProps = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;