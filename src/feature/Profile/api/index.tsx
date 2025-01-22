import { jwtDecode } from 'jwt-decode';
import { User } from '../../../models/datamodels';
import { apiClient, apiClient2 } from '../../../services/apiClient';

// Fetch a single user by ID
const getUserById = async (userId: string): Promise<User> => {
  console.log('Fetching user with ID:', userId);
  const { data } = await apiClient.get(`/api-v1/users/${userId}`);
  return data as User;
};

// Fetch all users
const getAllUsers = async (): Promise<User[]> => {
  console.log('Fetching all users');
  const { data } = await apiClient.get('/api-v1/users');
  return data as User[];
};

// Update a user by ID
const updateUser = async (user: User): Promise<User | undefined> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return undefined;
  }
  const tokenDecoded = jwtDecode(token);
  console.log('second', tokenDecoded.sub, user);
  const { data } = await apiClient2.patch(`/api-V1/users/${tokenDecoded.sub}`, user);
  return data as User;
};

// Delete a user by ID
const deleteUser = async (userId: string): Promise<User | undefined> => {
  console.log('Deleting user with ID:', userId);
  const { data } = await apiClient.delete(`/api-v1/users/${userId}`);
  return data as User;
};

export { deleteUser, getAllUsers, getUserById, updateUser };
