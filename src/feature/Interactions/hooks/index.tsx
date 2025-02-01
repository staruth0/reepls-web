import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../api";
import { Reaction} from "../../../models/datamodels";

// Reactions Hooks
export const useCreateReaction = () => {
  return useMutation({
    mutationFn: (reaction: Reaction) => createReaction(reaction),
    onSuccess: (data) => {
      console.log("Reaction created:", data);
    },
    onError: (error) => {
      console.error("Error creating reaction:", error);
    },
  });
};

export const useGetReactionById = (reactionId: string) => {
  return useQuery({
    queryKey: ["reaction", reactionId],
    queryFn: () => getReactionById(reactionId),
  });
};

export const useUpdateReaction = () => {
  return useMutation({
    mutationFn: ({ reactionId, type }: { reactionId: string; type: string }) =>
      updateReaction(reactionId, type),
    onSuccess: (data) => {
      console.log("Reaction updated:", data);
    },
    onError: (error) => {
      console.error("Error updating reaction:", error);
    },
  });
};

export const useDeleteReaction = () => {
  return useMutation({
    mutationFn: (reactionId: string) => deleteReaction(reactionId),
    onSuccess: (data) => {
      console.log("Reaction deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting reaction:", error);
    },
  });
};

export const useGetAuthorScoresByCategory = (category: string) => {
  return useQuery({
    queryKey: ["authorScores", category],
    queryFn: () => getAuthorScoresByCategory(category),
  });
};

// Following Hooks
export const useFollowUser = () => {
  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: (data) => {
      console.log("User followed:", data);
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });
};

export const useUnfollowUser = () => {
  return useMutation({
    mutationFn: (followedId: string) => unfollowUser(followedId),
    onSuccess: (data) => {
      console.log("User unfollowed:", data);
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
    queryFn: () => getFollowing(userId)
  });
};


