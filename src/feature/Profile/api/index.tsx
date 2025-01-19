import { apiClient, apiClient2 } from "../../../services/apiClient";
import { User } from "../../../models/datamodels";
import { jwtDecode } from "jwt-decode";


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
const updateUser = async (user: User) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    const tokenDecoded = jwtDecode(token);
    console.log("second", tokenDecoded.sub, user);
    const { data } = await apiClient2.patch(
      `/api-V1/users/${tokenDecoded.sub}`,
      user
    );
    return data;
  }
};

// Delete a user by ID
const deleteUser = async (userId: string) => {
  console.log("Deleting user with ID:", userId);
  const { data } = await apiClient.delete(`/api-v1/users/${userId}`);
  return data;
};

export { getUserById, getAllUsers, updateUser, deleteUser };
