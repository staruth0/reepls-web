import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../api";
import { User } from "../../../models/datamodels";
import { useNavigate } from "react-router-dom";


// Hook for fetching a single user by ID
export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
};

// Hook for fetching all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userId, user }: { userId: string; user: User }) =>
      updateUser(userId, user),
    onSuccess: (data, variables) => {
      console.log("User updated:", data);
      navigate(`/users/${variables.userId}`);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      console.log("User deleted");
      navigate("/users");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });
};
