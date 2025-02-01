import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,

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




