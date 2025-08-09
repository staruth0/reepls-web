import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";

import {
  repostArticle,
  addCommentToRepost,
  getCommentsTreeForRepost,
  getMyReposts,
  createUpdateReaction,
  getReactionByTarget,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAllReactionsForTarget,
  getReactionsGroupedByType,
  shareTarget,
  updateRepost,
  deleteRepost,
  cleanupOrphanedReposts,
  TargetType,
  ShareTargetType,
  getAllRepostComments,
  getCommentsByRepostId,

} from "../api/";

export const useRepostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, comment }: { articleId: string; comment?: string }) =>
      repostArticle(articleId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
     
    },
    onError: (error) => {
      void error;
    },
  });
};

/**
 * React Query hook to add a comment to a specific repost.
 */
export const useAddCommentToRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      repostId,
      content,
      parent_comment_id,
    }: {
      repostId: string;
      content: string;
      parent_comment_id?: string;
    }) => addCommentToRepost(repostId, { content, parent_comment_id }),
    onSuccess: ( ) => {
      queryClient.invalidateQueries({
        queryKey: ["repost-comments-tree"],
      });
      // Optionally, invalidate general reposts if comments affect their display
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
    },
    onError: (error) => {
      console.error("Failed to add comment to repost:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to fetch paginated comments for a repost, organized in a tree structure.
 * @param repostId The ID of the repost.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of comments per page (default: 10).
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetCommentsTreeForRepost = (
  repostId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["repost-comments-tree", repostId, page, limit],
    queryFn: () => getCommentsTreeForRepost(repostId, page, limit),
    enabled: enabled && !!repostId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * React Query hook to get paginated reposts created by the authenticated user.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of reposts per page (default: 10).
 */
export const useGetMyReposts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["my-reposts", page, limit],
    queryFn: () => getMyReposts(page, limit),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * React Query hook to create a new reaction or update an existing one.
 */
export const useCreateReactionRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      target_id: string;
      target_type: TargetType;
      type: string;
    }) => createUpdateReaction(variables),
    onSuccess: ( variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions-by-target", variables.target_type, variables.target_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactions-grouped-by-type", variables.target_type, variables.target_id],
      });
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
      if (variables.target_type === "Article") {
        queryClient.invalidateQueries({ queryKey: ["article", variables.target_id] });
      } else if (variables.target_type === "Comment") {
        queryClient.invalidateQueries({ queryKey: ["comment", variables.target_id] });
      } else if (variables.target_type === "Repost") {
        queryClient.invalidateQueries({ queryKey: ["repost", variables.target_id] });
      }
    },
    onError: (error) => {
      console.error("Failed to create or update reaction:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to retrieve a user's reaction to a specific target.
 * @param target_type The type of the target (e.g., "Article", "Comment", "Repost").
 * @param target_id The ID of the target.
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetReactionByTarget = (
  target_type: TargetType,
  target_id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reaction-by-target", target_type, target_id],
    queryFn: () => getReactionByTarget(target_type, target_id),
    enabled: enabled && !!target_id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * React Query hook to retrieve the details of a reaction using its unique ID.
 * @param reactionId The ID of the reaction.
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetReactionById = (reactionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["reaction", reactionId],
    queryFn: () => getReactionById(reactionId),
    enabled: enabled && !!reactionId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * React Query hook to modify an existing reaction's type.
 */
export const useUpdateReactionRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { reactionId: string; type: string }) =>
      updateReaction(variables.reactionId, { type: variables.type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reaction"] });
      // Depending on how you display reactions, you might need to invalidate broader queries.
      // E.g., queryClient.invalidateQueries({ queryKey: ["reactions-by-target"] });
    },
    onError: (error) => {
      console.error("Failed to update reaction:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to remove a reaction using its unique ID.
 */
export const useDeleteReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reactionId: string) => deleteReaction(reactionId),
    onSuccess: ( variables) => {
      queryClient.invalidateQueries({ queryKey: ["reaction", variables] });
      // Invalidate queries that might display this reaction or reaction counts
      // E.g., queryClient.invalidateQueries({ queryKey: ["reactions-by-target"] });
    },
    onError: (error) => {
      console.error("Failed to delete reaction:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to retrieve all reactions associated with a specific target with pagination.
 * @param target_type The type of the target.
 * @param id The ID of the target.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of reactions per page (default: 10).
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetAllReactionsForTarget = (
  target_type: TargetType,
  id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["all-reactions-for-target", target_type, id, page, limit],
    queryFn: () => getAllReactionsForTarget(target_type, id, page, limit),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * React Query hook to retrieve users grouped by their reaction type for a specific target.
 * @param target_type The type of the target.
 * @param id The ID of the target.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of results per page (default: 10).
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetReactionsGroupedByType = (
  target_type: TargetType,
  id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reactions-grouped-by-type", target_type, id, page, limit],
    queryFn: () => getReactionsGroupedByType(target_type, id, page, limit),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * React Query hook to update the share_count when an article or repost is shared.
 */
export const useShareTarget = () => {
 

  return useMutation({
    mutationFn: ({ target_type, id }: { target_type: ShareTargetType; id: string }) =>
      shareTarget(target_type, id),
  
    onError: (error) => {
      console.error("Failed to share target:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to update a repost commentary.
 */
export const useUpdateRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ repostId, comment }: { repostId: string; comment: string }) =>
      updateRepost(repostId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
    onError: (error) => {
      console.error("Failed to update repost:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to delete a repost.
 */
export const useDeleteRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repostId: string) => deleteRepost(repostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
    onError: (error) => {
      console.error("Failed to delete repost:", error.message);
      // TODO: Implement user-facing error handling
    },
  });
};

/**
 * React Query hook to clean up orphaned reposts (Admin only).
 */
export const useCleanupOrphanedReposts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cleanupOrphanedReposts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
    onError: (error) => {
      console.error("Failed to cleanup orphaned reposts:", error);
      // TODO: Implement user-facing error handling
    },
  });
};

export function useAllRepostComments(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['repost-comments', page, limit],
    queryFn: () => getAllRepostComments({ page, limit }),
  });
}

// Hook for comments by repost ID
export function useCommentsByRepostId(repostId: string) {
  return useQuery({
    queryKey: ['repost-comments-by-id', repostId],
    queryFn: () => getCommentsByRepostId(repostId),
    enabled: !!repostId,
  });
}