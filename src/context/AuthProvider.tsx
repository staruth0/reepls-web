import React, { ReactNode,  useState } from "react";
import { AuthContext } from "./authContext";
import { useTokenStorage } from "../feature/Auth/hooks/useTokenStorage";


const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserIdState] = useState<string>("");
    const {getAccessToken } = useTokenStorage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = getAccessToken(); 
        return !!token; 
  });

  const setUserId = (value: string) => {
    setUserIdState(value);
  };


  return (
    <AuthContext.Provider
      value={{ userId, isAuthenticated, setUserId, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;