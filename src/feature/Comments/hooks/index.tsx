import { useQuery, useMutation, useQueryClient,useInfiniteQuery } from "@tanstack/react-query";
import {
  createComment,
  getCommentsByArticleId,
  getCommentsTreeForArticle,
  updateComment,
  deleteComment,
  getRepliesForComment,
} from "../api";
import { Comment } from "../../../models/datamodels";
import { handleMutationError } from "../../../utils/mutationErrorHandler";

// Hook to create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Comment) => createComment(comment),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      const previousComments = queryClient.getQueryData(["comments", newComment.article_id]);
      
      queryClient.setQueryData(["comments", newComment.article_id], (old: any) => {
        if (!old) return old;
        const newData = { ...old };
        if (newData.pages && newData.pages[0]?.data?.commentsTree) {
          newData.pages[0].data.commentsTree = [
            newComment,
            ...newData.pages[0].data.commentsTree
          ];
          newData.pages[0].data.totalComments = (newData.pages[0].data.totalComments || 0) + 1;
        }
        return newData;
      });
      
      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", variables.article_id], context.previousComments);
      }
      handleMutationError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

// Hook to fetch comments by article ID
export const useGetCommentsByArticleId = (articleId: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", articleId],
    queryFn: ({ pageParam = 1 }) => getCommentsByArticleId(articleId, pageParam, 8), 
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.data.totalPages;
      if (allPages.length < totalPages) {
        return allPages.length + 1; 
      }
      return undefined; // No more pages to fetch
    },
  });
};

// Hook to fetch comments tree for an article (new API)
export const useGetCommentsTreeForArticle = (
  articleId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["comments-tree", articleId, page, limit],
    queryFn: () => getCommentsTreeForArticle(articleId, page, limit),
    enabled: enabled && !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to update an existing comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({commentId,content}: {  commentId: string;content: string;}) => updateComment(commentId, content),
    onSuccess: () => {
  
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
     
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
  
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
     
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

// Hook to fetch replies for a specific comment
export const useGetRepliesForComment = (commentId: string) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getRepliesForComment(commentId),
  });
};
