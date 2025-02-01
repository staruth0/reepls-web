import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getRepliesForComment,
} from "../api";
import {  Comment } from "../../../models/datamodels";

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (comment: Comment) => createComment(comment),
    onSuccess: (data) => {
      console.log("Comment created:", data);
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};

export const useGetCommentsByArticleId = (articleId: string) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getCommentsByArticleId(articleId),
  });
};

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment(commentId, content),
    onSuccess: (data) => {
      console.log("Comment updated:", data);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (data) => {
      console.log("Comment deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};

export const useGetRepliesForComment = (commentId: string) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getRepliesForComment(commentId),
  });
};
