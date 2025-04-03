import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User } from "../../../models/datamodels";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  getReccomendedUsersById,
} from "../api";

// Hook for fetching a single user by ID
export const useGetUserById = (
  userId: string
): { user: User | undefined; isLoading: boolean; error: Error | null } => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
  return { user: data, isLoading, error };
};

// Hook for fetching a single user by username
export const useGetUserByUsername = (
  username: string
): { user: User | undefined; isLoading: boolean; error: Error | null } => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
  });
  return { user: data, isLoading, error };
};

// Hook for fetching all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });
};

// Hook for updating a user
export const useUpdateUser = (): {
  mutate: (user: User) => void;
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
} => {
  const queryClient = useQueryClient();
  

  const { mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
    
      queryClient.invalidateQueries({ queryKey: ["user"] });
     
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
  return { mutate, isPending, error, isError, isSuccess };
};

// Hook for deleting a user
export const useDeleteUser = (): {
  mutate: (userId: string) => void;
  isPending: boolean;
  error: Error | null;
} => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      console.log("User deleted");
      // Invalidate the users query to refetch the list of users
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
  return { mutate, isPending, error };
};





export const useGetRecommendedUsersById = ( userId: string) => {
  return useQuery({
    queryKey: ["recommended-users"],
    queryFn: () => getReccomendedUsersById(userId),
    enabled: !!userId, 
  });
  
};