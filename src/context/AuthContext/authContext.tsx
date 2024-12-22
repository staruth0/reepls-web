import { createContext } from "react";

export interface AuthContextProps {
  userId: string;
  token: string;
}

export interface AuthProviderProps {
  authState: AuthContextProps | null;
  login: (token: string) => void;
  logout: () => void;
  checkTokenExpiration: () => boolean;
  loading: boolean;
}

const initialState: AuthProviderProps = {
  authState: null,
  login: () => {},
  logout: () => {},
  checkTokenExpiration: () => false,
  loading: true,
};

const AuthContext = createContext<AuthProviderProps>(initialState);

export { AuthContext };
