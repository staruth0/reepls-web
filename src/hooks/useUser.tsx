import { useContext } from 'react';
import { User } from '../models/datamodels'; 
import { AuthContext } from '../context/AuthContext/authContext';

export const useUser = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);

  return {
    authUser: user as User , 
    isLoggedIn,
    logout,
  };
};