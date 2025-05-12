import { Article } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";

// Create a new article
const createArticle = async (article: Article) => {
  const { data } = await apiClient.post("/articles", article);
  return data;
};

// Fetch a single article by ID
const getArticleById = async (articleId: string) => {
  const { data } = await apiClient.get(`/articles/get-by-id/${articleId}`);
  return data;
};
// Fetch a single article by slug
export const getArticleBySlug = async (slug: string) => {
  const { data } = await apiClient.get(`/articles/slug/${slug}`);
  return data;
};

// Fetch articles by author ID
const getArticleByAuthorId = async (authorId: string) => {
  const { data } = await apiClient.get(`/articles/author/${authorId}`);
  return data;
};

// Fetch all articles
// Fetch articles for a specific page
const getAllArticles = async ({ pageParam = 1 }) => {
  const { data } = await apiClient.get(`/articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch all articles of an author a user is following
const getFollowedArticles = async ({ pageParam = 1 }) => {
  const { data } = await apiClient.get(`/articles/followed-articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch all articles where is_communiquer is true
const getCommuniquerArticles = async ({ pageParam = 1 }) => {
  const { data } = await apiClient.get(`/articles/communiquer-articles?page=${pageParam}&limit=10`);
  return data;
};



export const getAuthorPosts = async ({ pageParam = 1, authorId }:{pageParam:number, authorId:string}) => {
  const { data } = await apiClient.get(`/articles/author/${authorId}/posts?page=${pageParam}&limit=10`);
  return data;
};

export const getAuthorArticles = async ({ pageParam = 1, authorId }:{pageParam:number, authorId:string}) => {
  const { data } = await apiClient.get(`/articles/author/${authorId}/articles?page=${pageParam}&limit=10`);
  return data;
};

// Fetch recommended articles with pagination
const getRecommendedArticles = async ({ pageParam = 1 }) => {
  const { data } = await apiClient.get(`/articles/recommended-articles?page=${pageParam}&limit=10`);
  return data;
};


// Fetch articles by category
const getArticlesByCategory = async (category: string) => {
  const { data } = await apiClient.get(`/articles/category/${category}`);
  return data;
};
// Fetch articles by category
const getArticleStatitics = async (id: string) => {
  const { data } = await apiClient.get(`/articles/statistics/${id}`);
  return data;
};

// Update an article by ID
const updateArticle = async (articleId: string, article: Article) => {
  const { data } = await apiClient.patch(`/articles/${articleId}`, article);
  return data;
};

// Delete an article by ID
const deleteArticle = async (articleId: string) => {
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
  getArticleStatitics
};
