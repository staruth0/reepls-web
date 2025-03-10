import { jwtDecode } from 'jwt-decode';
import React, { ReactNode, useEffect, useState } from 'react';
import { ACCESS_TOKEN_KEY} from '../../constants';
import { AuthContext, AuthContextProps } from './authContext';

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextProps | null>(() => {
    const token = getStoredToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { userId: decoded.sub!, token };
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
    return null;
  });


  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      console.log("decodedToken", decoded);
      setAuthState({ userId: decoded.sub!, token });
      console.log({ userId: decoded.sub!, token });
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      console.error('Invalid token');
    }
  };

  const logout = () => {
    setAuthState(null);
    localStorage.clear();
  };

  useEffect(() => {
    console.log('authstate is this', authState);
  }, [authState]);


  return (
    <AuthContext.Provider value={{ authState, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
