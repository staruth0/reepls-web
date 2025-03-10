import { createContext } from "react";

export interface AuthContextProps {
  userId: string;
  token: string;
}

export interface AuthProviderProps {
  authState: AuthContextProps | null;
  login: (token: string) => void;
  logout: () => void;
}

const initialState: AuthProviderProps = {
  authState: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthProviderProps>(initialState);


