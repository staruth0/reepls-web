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
      if (decoded.exp! < Date.now() / 1000) {
        logout();
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
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

    validateSession();
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
