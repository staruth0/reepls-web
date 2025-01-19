import { apiClient } from "../../../services/apiClient";
import { User } from "../../../models/datamodels";


// Fetch a single user by ID
const getUserById = async (userId: string) => {
  console.log("Fetching user with ID:", userId);
  const { data } = await apiClient.get(`/api-v1/users/${userId}`);
  return data;
};

// Fetch all users
const getAllUsers = async () => {
  console.log("Fetching all users");
  const { data } = await apiClient.get("/api-v1/users");
  return data;
};

// Update a user by ID
const updateUser = async (userId: string, user: User) => {
  console.log("Updating user with ID:", userId, "Data:", user);
  const { data } = await apiClient.patch(`/api-v1/users/${userId}`, user);
  return data;
};

// Delete a user by ID
const deleteUser = async (userId: string) => {
  console.log("Deleting user with ID:", userId);
  const { data } = await apiClient.delete(`/api-v1/users/${userId}`);
  return data;
};

export { getUserById, getAllUsers, updateUser, deleteUser };
