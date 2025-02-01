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



//Following

// Follow a user
const followUser = async (followedId: string) => {
  console.log('Following user with ID:', followedId);
  const { data } = await apiClient.post('/follow', { followedId });
  return data;
};

// Unfollow a user
const unfollowUser = async (followedId: string) => {
  console.log('Unfollowing user with ID:', followedId);
  const { data } = await apiClient.delete('/follow', { data: { followedId } });
  return data;
};

// Get followers of a user
const getFollowers = async (userId: string) => {
  console.log('Fetching followers for user with ID:', userId);
  const { data } = await apiClient.get(`/follow/${userId}/followers`);
  return data;
};

// Get users followed by a user
const getFollowing = async (userId: string) => {
    console.log('Fetching users followed by user with ID:', userId);
    const { data } = await apiClient.get(`/follow/${userId}/following`);
    return data;
}






export {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
