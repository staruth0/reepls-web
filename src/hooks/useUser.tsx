import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/authContext";
import { getUserById } from "../feature/Profile/api";
import { User } from "../models/datamodels";

export const useUser = () => {
  const { authState } = useContext(AuthContext);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authState?.userId) {
        setAuthUser(null); 
        return;
      }

      setLoading(true);
      try {
        const user = await getUserById(authState.userId);
        setAuthUser(user);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authState]);

  return { authUser, loading, error };
};