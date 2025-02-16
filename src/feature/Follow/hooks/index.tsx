import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../api";

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: (data, followedId) => {
      console.log("User followed:", data);

      // Manually update the "following" query cache
      queryClient.setQueryData(
        ["following", data.followerId], 
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [...oldData.data, { followed_id: followedId }],
          };
        }
      );

      // Invalidate queries to refetch data in the background
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

      // Manually update the "following" query cache
      queryClient.setQueryData(
        ["following", data.followerId], // Query key for the following list
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter(
              (following: { followed_id: string }) =>
                following.followed_id !== followedId
            ), // Remove the unfollowed user
          };
        }
      );

      // Invalidate queries to refetch data in the background
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
