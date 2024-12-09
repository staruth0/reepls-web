import { createContext } from "react";

export interface AuthContextProps {
  userId: string;
  token: string;
}

export interface AuthProviderProps {
  authState: AuthContextProps | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const initialState: AuthProviderProps = {
  authState: null, 
  login: () => {}, 
  logout: () => {}, 
  loading: true, 
};

const AuthContext = createContext<AuthProviderProps>(initialState);

export { AuthContext };
