import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getRepliesForComment,
} from "../api";
import { Comment } from "../../../models/datamodels";
import { toast } from "react-toastify"; 
import { useEffect } from "react";

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
      toast.success("you added 1 comment!", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error commenting. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error creating comment:", error);
    },
  });
};

// Hook to fetch comments by article ID
export const useGetCommentsByArticleId = (articleId: string) => {
  const query = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getCommentsByArticleId(articleId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching comments:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook to update an existing comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onSuccess: (data, variables) => {
      console.log("Comment updated:", data);
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.commentId],
      });
      toast.success("Comment updated successfully!", { position: "top-right" }); 
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error updating comment. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
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
      toast.success("Comment deleted successfully!", { position: "top-right" });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error deleting comment. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error deleting comment:", error);
    },
  });
};

// Hook to fetch replies for a specific comment
export const useGetRepliesForComment = (commentId: string) => {
  const query = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getRepliesForComment(commentId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching replies:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};