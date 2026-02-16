import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { useUser } from "../../../hooks/useUser";

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
  getRepostCount,
  getRepostCountSimple,

} from "../api/";
import { handleMutationError } from "../../../utils/mutationErrorHandler";

import {
  saveRepost,
  removeSavedRepost,
  getSavedReposts,
} from "../api";

export const useRepostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, comment }: { articleId: string; comment?: string }) =>
      repostArticle(articleId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["repost-count"] });
     
    },
    onError: (error) => {
      handleMutationError(error);
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
    retry: false,
    onSuccess: ( ) => {
      queryClient.invalidateQueries({
        queryKey: ["repost-comments-tree"],
      });
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
    },
    onError: (error) => {
      handleMutationError(error);
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
  });
};

/**
 * React Query hook to get paginated reposts created by a specific user.
 * @param userId The ID of the user whose reposts to retrieve.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of reposts per page (default: 10).
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetMyReposts = (
  userId: string, 
  page: number = 1, 
  limit: number = 10, 
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["my-reposts", userId, page, limit],
    queryFn: () => getMyReposts(userId, page, limit),
    enabled: enabled && !!userId,
  });
};

/**
 * React Query hook to create a new reaction or update an existing one.
 */
export const useCreateReactionRepost = () => {
  const queryClient = useQueryClient();
  const { authUser } = useUser();

  return useMutation({
    mutationFn: (variables: {
      target_id: string;
      target_type: TargetType;
      type: string;
    }) => createUpdateReaction(variables),
    onMutate: async (variables) => {
      const currentUserId = authUser?.id;
      await queryClient.cancelQueries({ queryKey: ["all-reactions-for-target"] });
      await queryClient.cancelQueries({ queryKey: ["reactions-by-target"] });
      await queryClient.cancelQueries({ queryKey: ["reactions-grouped-by-type"] });

      const affected = queryClient.getQueriesData({ queryKey: ["all-reactions-for-target"] });
      const previousStates: Array<{ queryKey: any[]; data: unknown }> = [];

      affected.forEach(([key, oldData]) => {
        previousStates.push({ queryKey: key as any[], data: oldData });

        const [, keyTargetType, keyTargetId] = (key as any[]);
        if (keyTargetType !== variables.target_type || keyTargetId !== variables.target_id) return;

        const draft: any = oldData || { data: { reactions: [], totalReactions: 0 } };
        const reactions = Array.isArray(draft?.data?.reactions) ? [...draft.data.reactions] : [];
        const total = typeof draft?.data?.totalReactions === "number" ? draft.data.totalReactions : reactions.length;

        if (!currentUserId) return;

        const idx = reactions.findIndex((r: any) => r?.user_id === currentUserId);
        let nextReactions = reactions;
        let nextTotal = total;

        if (idx >= 0) {
          const existing = reactions[idx];
          if (existing?.type === variables.type) {
            nextReactions = reactions.filter((_: any, i: number) => i !== idx);
            nextTotal = Math.max(0, total - 1);
          } else {
            nextReactions = reactions.slice();
            nextReactions[idx] = { ...existing, type: variables.type };
          }
        } else {
          nextReactions = [
            ...reactions,
            {
              user_id: currentUserId,
              target_id: variables.target_id,
              target_type: variables.target_type,
              type: variables.type,
            },
          ];
          nextTotal = total + 1;
        }

        queryClient.setQueryData(key, {
          data: {
            reactions: nextReactions,
            totalReactions: nextTotal,
          },
        });
      });

      return { previousStates };
    },
    onSuccess: ( variables) => {
       queryClient.invalidateQueries({
        queryKey: ["all-reactions-for-target"],
      });
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
    onError: (error, _variables, context) => {
      const prev = (context as any)?.previousStates as Array<{ queryKey: any[]; data: unknown }> | undefined;
      if (prev) {
        prev.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      handleMutationError(error);
    },
    onSettled: (variables) => {
      if (variables) {
        queryClient.invalidateQueries({ queryKey: ["all-reactions-for-target", variables.target_type, variables.target_id] });
      }
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
      handleMutationError(error);
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
      handleMutationError(error);
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  
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
      handleMutationError(error);
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
      handleMutationError(error);
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
      queryClient.invalidateQueries({ queryKey: ["repost-count"] });
    },
    onError: (error) => {
      handleMutationError(error);
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
      handleMutationError(error);
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


export const useSaveRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repostId: string) => saveRepost(repostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-reposts"] });
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useRemoveSavedRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repostId: string) => removeSavedRepost(repostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-reposts"] });
      queryClient.invalidateQueries({ queryKey: ["my-reposts"] });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useGetSavedReposts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["saved-reposts", page, limit],
    queryFn: () => getSavedReposts(page, limit),
  });
};

/**
 * React Query hook to get the repost count for a specific article.
 * @param articleId The ID of the article to get repost count for.
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetRepostCount = (articleId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["repost-count"],
    queryFn: () => getRepostCount(articleId),
    enabled: enabled && !!articleId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

/**
 * React Query hook to get the simplified repost count for a specific article.
 * @param articleId The ID of the article to get repost count for.
 * @param enabled A boolean to control when the query runs (default: true).
 */
export const useGetRepostCountSimple = (articleId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["repost-count-simple", articleId],
    queryFn: () => getRepostCountSimple(articleId),
    enabled: enabled && !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes - repost counts don't change frequently
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};