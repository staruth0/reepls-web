import { apiClient } from "../../../services/apiClient";
import {
  CreateReadingProgressRequest,
  UpdateReadingProgressRequest,
  ReadingProgressResponse,
  ReadingProgressListResponse,
  PaginationParams,
} from "../types";

// Create reading progress for an article
const createReadingProgress = async (readingProgress: CreateReadingProgressRequest) => {
  const { data } = await apiClient.post("/reading-progress", readingProgress);
  return data as ReadingProgressResponse;
};

// Get reading progress for a specific article
const getReadingProgressByArticleId = async (articleId: string) => {
  const { data } = await apiClient.get(`/reading-progress/${articleId}`);
  return data as ReadingProgressResponse;
};

// Update reading progress for an article
const updateReadingProgress = async (articleId: string, readingProgress: UpdateReadingProgressRequest) => {
  const { data } = await apiClient.put(`/reading-progress/${articleId}`, readingProgress);
  return data as ReadingProgressResponse;
};

// Delete reading progress for an article
const deleteReadingProgress = async (articleId: string) => {
  const { data } = await apiClient.delete(`/reading-progress/${articleId}`);
  return data as ReadingProgressResponse;
};

// Get user's reading progress with pagination
const getUserReadingProgress = async (params: PaginationParams = {}) => {
  const { page = 1, limit = 10 } = params;
  const { data } = await apiClient.get(`/reading-progress/user?page=${page}&limit=${limit}`);
  return data as ReadingProgressListResponse;
};

export {
  createReadingProgress,
  getReadingProgressByArticleId,
  updateReadingProgress,
  deleteReadingProgress,
  getUserReadingProgress,
};
