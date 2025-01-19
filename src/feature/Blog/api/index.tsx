import { apiClient } from "../../../services/apiClient";
import { Article } from "../../../models/datamodels";

// Create a new article
const createArticle = async (article: Article) => {
  console.log("Creating article:", article);
  const { data } = await apiClient.post("/api-v1/articles", article);
  return data;
};

// Fetch a single article by ID
const getArticleById = async (articleId: string) => {
  console.log("Fetching article with ID:", articleId);
  const { data } = await apiClient.get(`/api-v1/articles/${articleId}`);
  return data;
};

// Fetch all articles
const getAllArticles = async () => {
  console.log("Fetching all articles");
  const { data } = await apiClient.get("/api-v1/articles?page=1&limit=20");
  return data;
};

// Update an article by ID
const updateArticle = async (articleId: string, article: Article) => {
  console.log("Updating article with ID:", articleId, "Data:", article);
  const { data } = await apiClient.patch(
    `/api-v1/articles/${articleId}`,
    article
  );
  return data;
};

// Delete an article by ID
const deleteArticle = async (articleId: string) => {
  console.log("Deleting article with ID:", articleId);
  const { data } = await apiClient.delete(`/api-v1/articles/${articleId}`);
  return data;
};

export {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
};
