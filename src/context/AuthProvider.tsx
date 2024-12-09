import React, { ReactNode, useState, useEffect } from "react";
import { AuthContext, AuthContextProps } from "./authContext";
import {jwtDecode} from "jwt-decode"; 

interface AuthProviderComponentProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderComponentProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token); 
      const user = { userId: decoded.sub!, token };
      console.log("authState",JSON.stringify(user))
      setAuthState(user);
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };


  const logout = () => {
    setAuthState(null);
    localStorage.removeItem("authToken");
  };


  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setAuthState({ userId: decoded.sub!, token: storedToken });
      } catch (error) {
        console.error("Invalid token, logging out.",error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
