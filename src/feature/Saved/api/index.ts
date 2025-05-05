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


export const getSavedPosts = async ({ pageParam = 1 }) => {
  console.log(`Fetching saved posts for page ${pageParam}`);
  try {
    const { data } = await apiClient.get(`/articles/saved-user-posts?page=${pageParam}&limit=10`);
    console.log("Saved Posts API Response:", data);
    return data || { articles: [], totalPosts: 0, totalPages: 1 }; // Fallback
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return { articles: [], totalPosts: 0, totalPages: 1 }; 
  }
};

export const getSavedArticle = async ({ pageParam = 1 }) => {
  console.log(`Fetching saved articles for page ${pageParam}`);
  try {
    const { data } = await apiClient.get(`/articles/saved-user-articles?page=${pageParam}&limit=10`);
    console.log("Saved Articles API Response:", data);
    return data || { articles: [], totalArticles: 0, totalPages: 1 }; 
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    return { articles: [], totalArticles: 0, totalPages: 1 }; 
  }
};

// Update reading history for a specific article
const updateReadingHistory = async (articleSlug:string) => {
  console.log(`Updating reading history for article: ${articleSlug}`);
  const { data } = await apiClient.patch(`/users/reading-history/${articleSlug}`);
  return data;
};

// Get reading history for the user
const getReadingHistory = async () => {
  console.log("Fetching reading history for current user");
  const { data } = await apiClient.get("/users/reading-history/fetch");
  return data;
};

// Delete reading history for a specific article
const deleteReadingHistory = async (articleSlug:string) => {
  console.log(`Deleting reading history for article: ${articleSlug}`);
  const { data } = await apiClient.delete(`/users/reading-history/${articleSlug}`);
  return data;
};

export { saveArticle, removeSavedArticle, getSavedArticles,updateReadingHistory,getReadingHistory,deleteReadingHistory };