import { jwtDecode } from 'jwt-decode';
import { User } from '../../../models/datamodels';
import { apiClient } from '../../../services/apiClient';
import { getDecryptedAccessToken } from '../../Auth/api/Encryption';

// Fetch a single user by ID
const getUserById = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data as User;
};
// Fetch a single user by ID
const getReccomendedUsersById = async (userId: string): Promise<User[]> => {
  const { data } = await apiClient.get(`/author/suggestions/${userId}`);
  return data as User[];
};

// Fetch a single user by username
const getUserByUsername = async (username: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${username}/username`);
  return data as User;
};

// Fetch all users
const getAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users/index');
  return data as User[];
};

// Update a user by ID
const updateUser = async (user: User): Promise<User | undefined> => {
  const token = getDecryptedAccessToken();
  if (!token) {
    return undefined;
  }
  const tokenDecoded = jwtDecode(token);
  const { data } = await apiClient.patch(`/users/${tokenDecoded.sub}`, user);
  return data as User;
};

// Delete a user by ID
const deleteUser = async (userId: string): Promise<User | undefined> => {
  const { data } = await apiClient.delete(`/users/${userId}`);
  return data as User;
};

interface FetchMediaParams {
  pageParam?: number;
  userId: string;
}

const getUserMedia = async ({ pageParam = 1, userId }: FetchMediaParams) => {
  const { data } = await apiClient.get(`/articles/user/${userId}/media?page=${pageParam}&limit=10`);
  return data;
};


export interface AuthorStatistics {
  views_count: number;
  reports_count: number;
  shares_count: number;
  reaction_count: number;
  comment_count: number;
  impression_count: number;
  engagement_count: number;
  author_follower_count: number;
  author_profile_views_count: number;
}

// Fetch author statistics by author ID
const getAuthorStatistics = async (authorId: string): Promise<AuthorStatistics> => {
  const { data } = await apiClient.get(`/articles/author/statistics/${authorId}`);
  return data as AuthorStatistics;
};

export { deleteUser, getAllUsers, getUserById, getUserByUsername, updateUser,getReccomendedUsersById ,getUserMedia,getAuthorStatistics};
