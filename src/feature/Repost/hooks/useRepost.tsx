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
  ReactionType,
  TargetType,
  ShareTargetType,

} from "../api/"; 



export const useRepostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, comment }: { articleId: string; comment?: string }) =>
      repostArticle(articleId, { comment }),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
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
    }: {
      repostId: string;
      content: string;
    }) => addCommentToRepost(repostId, { content }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["repost-comments-tree", variables.repostId],
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
 * React Query hook to get all articles reposted by the authenticated user.
 */
export const useGetMyReposts = () => {
  return useQuery({
    queryKey: ["my-reposts"],
    queryFn: getMyReposts,
    staleTime: 10 * 60 * 1000,
  });
};



/**
 * React Query hook to create a new reaction or update an existing one.
 */
export const useCreateUpdateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      target_id: string;
      target_type: TargetType;
      type: ReactionType;
    }) => createUpdateReaction(variables),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions-by-target", variables.target_type, variables.target_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactions-grouped-by-type", variables.target_type, variables.target_id],
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
export const useUpdateReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { reactionId: string; type: ReactionType }) =>
      updateReaction(variables.reactionId, { type: variables.type }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reaction", variables.reactionId] });
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
    onSuccess: (data, variables) => {
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ target_type, id }: { target_type: ShareTargetType; id: string }) =>
      shareTarget(target_type, id),
    onSuccess: (data, variables) => {
      if (variables.target_type === "Article") {
        queryClient.invalidateQueries({ queryKey: ["article", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
      } else if (variables.target_type === "Repost") {
        queryClient.invalidateQueries({ queryKey: ["repost", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
      }
    },
    onError: (error) => {
      console.error("Failed to share target:", error);
      // TODO: Implement user-facing error handling
    },
  });
};