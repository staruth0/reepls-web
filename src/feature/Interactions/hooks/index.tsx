import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  getReactedUsers,
  getArticleReactions,
  getReactionsPerType,
  createCommentReaction,
  getCommentReactions,
} from "../api";
import { Reaction } from "../../../models/datamodels";

// Reactions Hooks
export const useCreateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reaction: Reaction) => createReaction(reaction),
    onSuccess: () => {
      // Invalidate queries that might be affected by the creation of a reaction
      queryClient.invalidateQueries({
        queryKey: ["articleReactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactionsPerType"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactedUsers"],
      });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reactionId, type }: { reactionId: string; type: string }) =>
      updateReaction(reactionId, type),
    onSuccess: () => {
      // Invalidate queries that might be affected by the update of a reaction
      queryClient.invalidateQueries({
        queryKey: ["reaction"],
      });
      queryClient.invalidateQueries({
        queryKey: ["articleReactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactionsPerType"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactedUsers"],
      });
    },
    onError: (error) => {
      console.error("Error updating reaction:", error);
    },
  });
};

export const useDeleteReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reactionId: string) => deleteReaction(reactionId),
    onSuccess: () => {
      // Invalidate queries that might be affected by the deletion of a reaction
      queryClient.invalidateQueries({ queryKey: ["reaction"] });
      queryClient.invalidateQueries({
        queryKey: ["articleReactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactionsPerType"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactedUsers"],
      });
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

export const useGetReactedUsers = (articleId: string) => {
  return useQuery({
    queryKey: ["reactedUsers", articleId],
    queryFn: () => getReactedUsers(articleId),
  });
};

export const useGetArticleReactions = (articleId: string) => {
  return useQuery({
    queryKey: ["articleReactions", articleId],
    queryFn: () => getArticleReactions(articleId),
  });
};

export const useGetReactionsPerType = (articleId: string) => {
  return useQuery({
    queryKey: ["reactionsPerType", articleId],
    queryFn: () => getReactionsPerType(articleId),
  });
};


// Hook to create a reaction for a comment
export const useCreateCommentReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reaction: { type: string; user_id: string; comment_id: string }) =>
      createCommentReaction(reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commentReactions"],
      });
    },
    onError: (error) => {
      console.error("Error creating comment reaction:", error);
    },
  });
};

// Hook to fetch all reactions of a comment
export const useGetCommentReactions = (commentId: string) => {
  return useQuery({
    queryKey: ["commentReactions", commentId],
    queryFn: () => getCommentReactions(commentId),
    enabled: !!commentId, 
  });
};