import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: (data, variables) => {
      console.log("Comment created:", data);
     
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.article_id],
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};

// Hook to fetch comments by article ID
export const useGetCommentsByArticleId = (articleId: string) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getCommentsByArticleId(articleId),
  });
};

// Hook to update an existing comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({commentId,content}: {  commentId: string;content: string;}) => updateComment(commentId, content),
    onSuccess: (data, variables) => {
      console.log("Comment updated:", data);
  
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
     
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.commentId],
      });
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });
};

// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (data) => {
      console.log("Comment deleted:", data);
  
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
     
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
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
