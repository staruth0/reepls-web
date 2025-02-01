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





export {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,

};
