import { Article } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";

// Create a new article
const createArticle = async (article: Article) => {
  console.log("Creating article:", article);
  const { data } = await apiClient.post("/articles", article);
  return data;
};

// Fetch a single article by ID
const getArticleById = async (articleId: string) => {
  console.log("Fetching article with ID:", articleId);
  const { data } = await apiClient.get(`/articles/get-by-id/${articleId}`);
  return data;
};

// Fetch articles by author ID
const getArticleByAuthorId = async (authorId: string) => {
  console.log("Fetching article with ID:", authorId);
  const { data } = await apiClient.get(`/articles/author/${authorId}`);
  return data;
};

// Fetch all articles
// Fetch articles for a specific page
const getAllArticles = async ({ pageParam = 1 }) => {
  console.log(`Fetching articles for page ${pageParam}`);
  const { data } = await apiClient.get(`/articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch all articles of an author a user is following
const getFollowedArticles = async ({ pageParam = 1 }) => {
  console.log(`Fetching followed articles for page ${pageParam}`);
  const { data } = await apiClient.get(`/articles/followed-articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch all articles where is_communiquer is true
const getCommuniquerArticles = async ({ pageParam = 1 }) => {
  console.log(`Fetching communiqué articles for page ${pageParam}`);
  const { data } = await apiClient.get(`/articles/communiquer-articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch recommended articles
const getRecommendedArticles = async () => {
  console.log("Fetching recommended articles");
  const { data } = await apiClient.get("/articles/recommended-articles");
  return data;
};

// Fetch articles by category
const getArticlesByCategory = async (category: string) => {
  console.log("Fetching articles by category:", category);
  const { data } = await apiClient.get(`/articles/category/${category}`);
  return data;
};

// Update an article by ID
const updateArticle = async (articleId: string, article: Article) => {
  console.log("Updating article with ID:", articleId, "Data:", article);
  const { data } = await apiClient.patch(`/articles/${articleId}`, article);
  return data;
};

// Delete an article by ID
const deleteArticle = async (articleId: string) => {
  console.log("Deleting article with ID:", articleId);
  const { data } = await apiClient.delete(`/articles/${articleId}`);
  return data;
};

export {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  getCommuniquerArticles,
  getFollowedArticles,
  getArticleByAuthorId,
  getRecommendedArticles,
  getArticlesByCategory,
  updateArticle,
};
