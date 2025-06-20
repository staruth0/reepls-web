import { useQuery, useMutation, useQueryClient,useInfiniteQuery } from "@tanstack/react-query";
import {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getRepliesForComment,
} from "../api";
import { Comment } from "../../../models/datamodels";

// Hook to create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Comment) => createComment(comment),
    onSuccess: () => {
     
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error) => {
      void error;
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
      void error;
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
      void error;
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
