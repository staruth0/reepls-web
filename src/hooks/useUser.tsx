import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext/authContext';
import { getUserById } from '../feature/Profile/api';
import { User } from '../models/datamodels';

export const useUser = () => {
  const { authState, loading } = useContext(AuthContext);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (authState) {
      getUserById(authState.userId)
        .then(setAuthUser)
        .finally(() => setIsLoading(false));
    }
  }, [authState]);

  return { authUser, isLoading };
};
