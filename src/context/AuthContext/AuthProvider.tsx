import React, { ReactNode, useState, useEffect, useCallback } from "react";
import { AuthContext, AuthContextProps } from "./authContext";
import { jwtDecode } from "jwt-decode";

interface AuthProviderComponentProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderComponentProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      console.log("decodedToken", decoded);
      const user = { userId: decoded.sub!, token };
      console.log("authState", JSON.stringify(user));
      setAuthState(user);
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const checkTokenExpiration = useCallback(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp! < currentTime) {
        logout();
        return true;
      }
    }

    return false;
  },[]); ;

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem("authToken");
    localStorage.clear();
  };

  useEffect(() => {
    const isExpired = checkTokenExpiration();
    if (isExpired) {
      console.log(isExpired);
      logout();
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        setAuthState({ userId: decoded.sub!, token: storedToken });
        console.log("authState.....", {
          userId: decoded.sub!,
          token: storedToken,
        });
      }
    }
    setLoading(false);
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
