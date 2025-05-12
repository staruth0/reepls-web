import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MediaResponse, PostMedia, User } from "../../../models/datamodels";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  getReccomendedUsersById,
  getUserMedia,
  getAuthorStatistics,
  AuthorStatistics,
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
    onSuccess: () => {
    
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

export const useGetUserMedia = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['userMedia', userId],
    queryFn: ({ pageParam }) => getUserMedia({ pageParam, userId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: MediaResponse, allPages: MediaResponse[]) => {
      const mediaFetched = allPages.reduce((acc, page) => {
        return acc + page.mediaData.reduce((sum: number, post: PostMedia) => sum + post.media.length, 0);
      }, 0);
      if (mediaFetched < lastPage.totalMedia) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!userId,
  });
};

// Hook for fetching author statistics by author ID
export const useGetAuthorStatistics = (
  authorId: string
): { statistics: AuthorStatistics | undefined; isLoading: boolean; error: Error | null } => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['authorStatistics', authorId],
    queryFn: () => getAuthorStatistics(authorId),
  });
  return { statistics: data, isLoading, error };
};