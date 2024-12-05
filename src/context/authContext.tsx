import { createContext } from "react";

export interface AuthContextProps {
  userId: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (value:boolean) => void;
  setUserId: (userid: string) => void;
}

const initialState: AuthContextProps = {
  userId: "",
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setUserId: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialState);

export { AuthContext };
 