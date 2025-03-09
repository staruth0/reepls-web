import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../api";
import { toast } from "react-toastify"; 
import { useEffect } from "react"; // Import useEffect

// Following Hooks
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: (data, followedId) => {
      console.log("User followed:", data);

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["followers", followedId] });
      queryClient.invalidateQueries({
        queryKey: ["following", data.followerId],
      });

      toast.success("User followed successfully!", { position: "top-left" }); 
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error following user. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); 
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

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["followers", followedId] });
      queryClient.invalidateQueries({
        queryKey: ["following", data.followerId],
      });

      toast.success("User unfollowed successfully!", { position: "top-right" }); 
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error unfollowing user. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error unfollowing user:", error);
    },
  });
};

export const useGetFollowers = (userId: string) => {
  const query = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching followers:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetFollowing = (userId: string) => {
  const query = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching following list:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};