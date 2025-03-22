import { jwtDecode } from 'jwt-decode';
import { User } from '../../../models/datamodels';
import { apiClient } from '../../../services/apiClient';
import { getDecryptedAccessToken } from '../../Auth/api/Encryption';

// Fetch a single user by ID
const getUserById = async (userId: string): Promise<User> => {
  console.log('Fetching user with ID:', userId);
  const { data } = await apiClient.get(`/users/${userId}`);
  return data as User;
};
// Fetch a single user by ID
const getReccomendedUsersById = async (userId: string): Promise<User[]> => {
  console.log('Fetching user with ID:', userId);
  const { data } = await apiClient.get(`/author/suggestions/${userId}`);
  return data as User[];
};

// Fetch a single user by username
const getUserByUsername = async (username: string): Promise<User> => {
  console.log('Fetching user with username:', username);
  const { data } = await apiClient.get(`/users/${username}/username`);
  return data as User;
};

// Fetch all users
const getAllUsers = async (): Promise<User[]> => {
  console.log('Fetching all users');
  const { data } = await apiClient.get('/users');
  return data as User[];
};

// Update a user by ID
const updateUser = async (user: User): Promise<User | undefined> => {
  const token = getDecryptedAccessToken();
  if (!token) {
    return undefined;
  }
  const tokenDecoded = jwtDecode(token);
  console.log('second', tokenDecoded.sub, user);
  const { data } = await apiClient.patch(`/users/${tokenDecoded.sub}`, user);
  return data as User;
};

// Delete a user by ID
const deleteUser = async (userId: string): Promise<User | undefined> => {
  console.log('Deleting user with ID:', userId);
  const { data } = await apiClient.delete(`/users/${userId}`);
  return data as User;
};

export { deleteUser, getAllUsers, getUserById, getUserByUsername, updateUser,getReccomendedUsersById };
