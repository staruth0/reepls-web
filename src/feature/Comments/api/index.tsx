import { apiClient } from "../../../services/apiClient";
import { Comment } from "../../../models/datamodels";

// Create a comment
const createComment = async (comment: Comment) => {
  const { data } = await apiClient.post("/comment", comment);
  return data;
};

// Get comments for an article
const getCommentsByArticleId = async (articleId: string, page: number, limit: number) => {
  const { data } = await apiClient.get(`/comment/article/${articleId}?page=${page}&limit=${limit}`);
  return data;
};

// Update a comment
const updateComment = async (commentId: string, content: string) => {
  const { data } = await apiClient.put(`/comment/${commentId}`, { content });
  return data;
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  const { data } = await apiClient.delete(`/comment/${commentId}`);
  return data;
};

// Get replies for a comment
const getRepliesForComment = async (commentId: string) => {
  const { data } = await apiClient.get(`/comment/replies/${commentId}`);
  return data;
};


export {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getRepliesForComment,
};