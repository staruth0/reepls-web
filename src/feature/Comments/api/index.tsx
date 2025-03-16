import { apiClient } from "../../../services/apiClient";
import { Comment } from "../../../models/datamodels";

// Create a comment
const createComment = async (comment: Comment) => {
  console.log("Creating comment:", comment);
  const { data } = await apiClient.post("/comment", comment);
  return data;
};

// Get comments for an article
const getCommentsByArticleId = async (articleId: string, page: number, limit: number) => {
  console.log(`Fetching comments for article ${articleId}, page ${page}`);
  const { data } = await apiClient.get(`/comment/article/${articleId}?page=${page}&limit=${limit}`);
  return data;
};

// Update a comment
const updateComment = async (commentId: string, content: string) => {
  console.log("Updating comment with ID:", commentId, "Content:", content);
  const { data } = await apiClient.put(`/comment/${commentId}`, { content });
  return data;
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  console.log("Deleting comment with ID:", commentId);
  const { data } = await apiClient.delete(`/comment/${commentId}`);
  return data;
};

// Get replies for a comment
const getRepliesForComment = async (commentId: string) => {
  console.log("Fetching replies for comment with ID:", commentId);
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