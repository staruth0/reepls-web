import { createContext } from 'react';
import { LoginResponse, User } from '../../models/datamodels';


export interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  login: (loginData: LoginResponse) => void; 
  logout: () => void;
}

const initialState: AuthContextProps = {
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialState);