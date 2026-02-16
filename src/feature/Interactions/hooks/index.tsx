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
import { handleMutationError } from "../../../utils/mutationErrorHandler";

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
      handleMutationError(error);
    },
  });
};

export const useGetReactionById = (reactionId: string) => {
  return useQuery({
    queryKey: ["reaction", reactionId],
    queryFn: () => getReactionById(reactionId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!reactionId,
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
                queryKey: ["reactions"],
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
      handleMutationError(error);
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
      queryClient.invalidateQueries({ queryKey: ["reactions"] });
      queryClient.invalidateQueries({queryKey: ["articleReactions"]});
      queryClient.invalidateQueries({queryKey: ["reactionsPerType"]});
      queryClient.invalidateQueries({queryKey: ["reactedUsers"]});
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useGetAuthorScoresByCategory = (category: string) => {
  return useQuery({
    queryKey: ["authorScores", category],
    queryFn: () => getAuthorScoresByCategory(category),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!category,
  });
};

export const useGetReactedUsers = (articleId: string) => {
  return useQuery({
    queryKey: ["reactedUsers", articleId],
    queryFn: () => getReactedUsers(articleId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!articleId,
  });
};

export const useGetArticleReactions = (articleId: string) => {
  return useQuery({
    queryKey: ["articleReactions"],
    queryFn: () => getArticleReactions(articleId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!articleId,
  });
};

export const useGetReactionsPerType = (articleId: string) => {
  return useQuery({
    queryKey: ["reactionsPerType"],
    queryFn: () => getReactionsPerType(articleId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!articleId,
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
      handleMutationError(error);
    },
  });
};

// Hook to fetch all reactions of a comment
export const useGetCommentReactions = (commentId: string) => {
  return useQuery({
    queryKey: ["commentReactions"],
    queryFn: () => getCommentReactions(commentId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!commentId, 
  });
};