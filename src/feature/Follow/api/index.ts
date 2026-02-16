import { apiClient } from '../../../services/apiClient';

// Follow a user
const followUser = async (followedId: string) => {
  const { data } = await apiClient.post('/follow', { followedId });
  return data;
};

// Unfollow a user
const unfollowUser = async (followedId: string) => {
  const { data } = await apiClient.delete('/follow', { data: { followedId } });
  return data;
};

// Get followers of a user
const getFollowers = async (userId: string) => {
  const { data } = await apiClient.get(`/follow/${userId}/followers`);
  return data;
};

// Get users followed by a user
const getFollowing = async (userId: string) => {
  const { data } = await apiClient.get(`/follow/${userId}/following`);
  return data;
};

export { followUser, getFollowers, getFollowing, unfollowUser };
