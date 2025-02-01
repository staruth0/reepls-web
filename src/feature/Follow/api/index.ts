import { apiClient } from "../../../services/apiClient";

// Follow a user
const followUser = async (followedId: string) => {
  console.log("Following user with ID:", followedId);
  const { data } = await apiClient.post("/follow", { followedId });
  return data;
};

// Unfollow a user
const unfollowUser = async (followedId: string) => {
  console.log("Unfollowing user with ID:", followedId);
  const { data } = await apiClient.delete("/follow", { data: { followedId } });
  return data;
};

// Get followers of a user
const getFollowers = async (userId: string) => {
  console.log("Fetching followers for user with ID:", userId);
  const { data } = await apiClient.get(`/follow/${userId}/followers`);
  return data;
};

// Get users followed by a user
const getFollowing = async (userId: string) => {
  console.log("Fetching users followed by user with ID:", userId);
  const { data } = await apiClient.get(`/follow/${userId}/following`);
  return data;
};


export { followUser, unfollowUser, getFollowers, getFollowing };