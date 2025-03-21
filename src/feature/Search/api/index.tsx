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

export { 
  getSearchResults, 
  storeSearchSuggestion, 
  fetchSearchSuggestions,
  getPostResults,
  getArticleResults,
  getPeopleResults 
};