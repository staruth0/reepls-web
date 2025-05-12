import { apiClient } from "../../../services/apiClient";
import { Reaction } from "../../../models/datamodels";

// Create a new reaction
const createReaction = async (reaction: Reaction) => {
  const { data } = await apiClient.post("/react", reaction);
  return data;
};

// Fetch a reaction by ID
const getReactionById = async (reactionId: string) => {
  const { data } = await apiClient.get(`/react/${reactionId}`);
  return data;
};

// Update a reaction
const updateReaction = async (reactionId: string, type: string) => {
  const { data } = await apiClient.put(`/react/${reactionId}`, { type });
  return data;
};

// Delete a reaction
const deleteReaction = async (reactionId: string) => {
  const { data } = await apiClient.delete(`/react/${reactionId}`);
  return data;
};

// Fetch author scores by category
const getAuthorScoresByCategory = async (category: string) => {
  const { data } = await apiClient.get(`/author/${category}/scores`);
  return data;
};

// Fetch users who reacted to an article
const getReactedUsers = async (articleId: string) => {
  const { data } = await apiClient.get(`/react/${articleId}/reacted-users`);
  return data;
};

// Fetch all reactions of an article
const getArticleReactions = async (articleId: string) => {
  const { data } = await apiClient.get(`/react/${articleId}/reactions`);
  return data;
};

// Fetch users grouped by reaction type for an article
const getReactionsPerType = async (articleId: string) => {
  
  const { data } = await apiClient.get(
    `/react/${articleId}/reactions/per-type`
  );
  return data;
};

// Create a reaction for a comment
const createCommentReaction = async (reaction: { type: string; user_id: string; comment_id: string }) => {
  const { data } = await apiClient.post(`/react/comments`, reaction);
  return data;
};

// Fetch all reactions of a comment
const getCommentReactions = async (commentId: string) => {
  const { data } = await apiClient.get(`/react/comments/${commentId}/reactions`);
  return data;
};

export {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  getReactedUsers,
  getArticleReactions,
  getReactionsPerType,
  createCommentReaction,
  getCommentReactions,
  
};
