import { Article } from '../../../models/datamodels';
import { apiClient } from '../../../services/apiClient';

// Create a new article
const createArticle = async (article: Article) => {
  console.log('Creating article:', article);
  const { data } = await apiClient.post('/articles', article);
  return data;
};

// Fetch a single article by ID
const getArticleById = async (articleId: string) => {
  console.log('Fetching article with ID:', articleId);
  const { data } = await apiClient.get(`/articles/${articleId}`);
  return data;
};
// Fetch a single articles by author ID
const getArticleByAuthorId = async (authorId: string) => {
  console.log('Fetching article with ID:', authorId);
  const { data } = await apiClient.get(`/articles/author/${authorId}`);
  return data;
};

// Fetch all articles
const getAllArticles = async () => {
  console.log('Fetching all articles');
  const { data } = await apiClient.get('/articles?page=1&limit=20');
  return data;
};

// Fetch all articles of an author a user is following
const getFollowedArticles = async () => {
  console.log('Fetching followed articles');
  const { data } = await apiClient.get('/articles/followed-articles');
  return data;
};

// Fetch all articles where is_communiquer is true
const getCommuniquerArticles = async () => {
  console.log('Fetching communique articles');
  const { data } = await apiClient.get('/articles/communiquer-articles');
  return data;
};

// Update an article by ID
const updateArticle = async (articleId: string, article: Article) => {
  console.log('Updating article with ID:', articleId, 'Data:', article);
  const { data } = await apiClient.patch(`/articles/${articleId}`, article);
  return data;
};

// Delete an article by ID
const deleteArticle = async (articleId: string) => {
  console.log('Deleting article with ID:', articleId);
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
  updateArticle,
};
