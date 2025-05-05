// api.ts
import { apiClient } from "../../../services/apiClient";


const getSearchResults = async (query: string) => {
  console.log("query string:", query);
  const { data } = await apiClient.get(`/search/result?searchQuery=${query}`);
  return data;
};

const storeSearchSuggestion = async (userId: string, searchSuggestion: string) => {
  const { data } = await apiClient.post(
    `/search/suggestions/${userId}?searchSuggestion=${searchSuggestion}`
  );
  return data;
};

const fetchSearchSuggestions = async (userId: string) => {
  const { data } = await apiClient.get(`/search/suggestions-fetch/${userId}`);
  return data;
};

// New functions
const getPostResults = async (query: string) => {
  const { data } = await apiClient.get(`/search/result?searchQuery=${query}&isArticle=false`);
  return data;
};

const getArticleResults = async (query: string) => {
  const { data } = await apiClient.get(`/search/articles?searchQuery=${query}`);
  return data;
};

const getPeopleResults = async (query: string) => {
  const { data } = await apiClient.get(`/search/people?searchQuery=${query}`);
  return data;
};

// Fetch titles for all articles
const getArticleTitles = async () => {
  console.log("Fetching titles for all articles");
  const { data } = await apiClient.get("/articles/metadata/article-titles", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
// Fetch keywords for all posts
const getPostKeywords = async () => {
  console.log("Fetching keywords for all posts");
  const { data } = await apiClient.get("/articles/metadata/post-keywords", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
// Fetch keywords for all posts
const getUserNames = async () => {
  console.log("Fetching user names");
  const { data } = await apiClient.get("/articles/metadata/user-name", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};


export { 
  getSearchResults, 
  storeSearchSuggestion, 
  fetchSearchSuggestions,
  getPostResults,
  getArticleResults,
  getPeopleResults ,
  getArticleTitles,
  getPostKeywords,
  getUserNames
};