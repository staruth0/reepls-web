import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { AuthContext, AuthContextProps } from "./authContext";
import { jwtDecode } from "jwt-decode";
import { refreshAuthTokens } from "../../feature/Auth/api/index";

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredToken = () => localStorage.getItem("access");

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextProps | null>(() => {
    const token = getStoredToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { userId: decoded.sub!, token };
      } catch {
        localStorage.removeItem("access");
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      setAuthState({ userId: decoded.sub!, token });
      console.log({ userId: decoded.sub!, token });
      localStorage.setItem("access", token);
    } catch {
      console.error("Invalid token");
    }
  };

  const logout = () => {
    setAuthState(null);
    localStorage.clear();
  };

const checkTokenExpiration = useCallback(() => {
  const token = getStoredToken();
  if (token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

  
    if (decoded.exp! < currentTime + 300) {
      return true; // Indicates token is about to expire
    }
  }
  return false;
}, []);

   const validateSession = async () => {
     if (checkTokenExpiration()) {
       try {
         const refreshToken = localStorage.getItem("refresh");
         if (refreshToken) {
           const data = await refreshAuthTokens(refreshToken);
           login(data.accessToken);
         } else {
           logout();
         }
       } catch {
         logout();
       }
     }
     setLoading(false);
   };

  useEffect(() => {
   

    const interval = setInterval(() => {
      validateSession();
    }, 5 * 60 * 1000); // Run every 5 minutes

    return () => clearInterval(interval);
  }, []);

  


  return (
    <AuthContext.Provider
      value={{ authState, login, logout, checkTokenExpiration, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
