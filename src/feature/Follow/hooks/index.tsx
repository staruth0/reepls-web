import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../api";

// Following Hooks
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: (data, followedId) => {
      console.log("User followed:", data);

    
      queryClient.invalidateQueries({ queryKey: ["followers", followedId] }); 
      queryClient.invalidateQueries({
        queryKey: ["following", data.followerId],
      }); 
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => unfollowUser(followedId),
    onSuccess: (data, followedId) => {
      console.log("User unfollowed:", data);

      queryClient.invalidateQueries({ queryKey: ["followers", followedId] }); 
      queryClient.invalidateQueries({
        queryKey: ["following", data.followerId],
      }); 
    },
    onError: (error) => {
      console.error("Error unfollowing user:", error);
    },
  });
};

export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId),
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });
};
