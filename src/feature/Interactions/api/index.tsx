import { apiClient } from "../../../services/apiClient";
import { Reaction } from "../../../models/datamodels";

// Create a new reaction
const createReaction = async (reaction: Reaction) => {
  console.log("Creating reaction:", reaction);
  const { data } = await apiClient.post("/react", reaction);
  return data;
};

// Fetch a reaction by ID
const getReactionById = async (reactionId: string) => {
  console.log("Fetching reaction with ID:", reactionId);
  const { data } = await apiClient.get(`/react/${reactionId}`);
  return data;
};

// Update a reaction
const updateReaction = async (reactionId: string, type: string) => {
  console.log("Updating reaction with ID:", reactionId, "Type:", type);
  const { data } = await apiClient.put(`/react/${reactionId}`, { type });
  return data;
};

// Delete a reaction
const deleteReaction = async (reactionId: string) => {
  console.log("Deleting reaction with ID:", reactionId);
  const { data } = await apiClient.delete(`/react/${reactionId}`);
  return data;
};

// Fetch author scores by category
const getAuthorScoresByCategory = async (category: string) => {
  console.log("Fetching author scores for category:", category);
  const { data } = await apiClient.get(`/author/${category}/scores`);
  return data;
};

// Fetch users who reacted to an article
const getReactedUsers = async (articleId: string) => {
  console.log("Fetching users who reacted to article:", articleId);
  const { data } = await apiClient.get(`/react/${articleId}/reacted-users`);
  return data;
};

// Fetch all reactions of an article
const getArticleReactions = async (articleId: string) => {
  console.log("Fetching all reactions for article:", articleId);
  const { data } = await apiClient.get(`/react/${articleId}/reactions`);
  return data;
};

// Fetch users grouped by reaction type for an article
const getReactionsPerType = async (articleId: string) => {
  console.log(
    "Fetching users grouped by reaction type for article:",
    articleId
  );
  const { data } = await apiClient.get(
    `/react/${articleId}/reactions/per-type`
  );
  return data;
};

// Create a reaction for a comment
const createCommentReaction = async (reaction: { type: string; user_id: string; comment_id: string }) => {
  console.log("Creating reaction for comment:", reaction.comment_id);
  const { data } = await apiClient.post(`/react/comments`, reaction);
  return data;
};

// Fetch all reactions of a comment
const getCommentReactions = async (commentId: string) => {
  console.log("Fetching all reactions for comment:", commentId);
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
