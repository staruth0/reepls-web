import { apiClient } from "../../../services/apiClient";

// Save an article for the user
const saveArticle = async (articleId: string) => {
  console.log("Saving article with ID:", articleId);
  const { data } = await apiClient.post(`/articles/saved-articles/${articleId}`);
  return data;
};

// Remove a saved article for the user
const removeSavedArticle = async (articleId: string) => {
  console.log("Removing saved article with ID:", articleId);
  const { data } = await apiClient.delete(`/articles/saved-articles/${articleId}`);
  return data;
};

// Get saved articles for the user
const getSavedArticles = async () => {
  console.log("Fetching saved articles for current user");
  const { data } = await apiClient.get("/articles/saved-articles");
  return data;
};

export { saveArticle, removeSavedArticle, getSavedArticles };