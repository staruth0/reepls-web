import { apiClient } from "../../../services/apiClient";

// Fetch search results from the backend API
const getSearchResults = async (query: string) => {
  console.log("query string:", query);
  const { data } = await apiClient.get(`/search/result?searchQuery=${query}`);
  return data;
};

// Store search suggestion
const storeSearchSuggestion = async (userId: string,searchSuggestion: string) => {
  const { data } = await apiClient.post(
    `/search/suggestions/${userId}?searchSuggestion=${searchSuggestion}`
  );
  return data;
};

// Fetch search suggestions
const fetchSearchSuggestions = async (userId: string) => {
  const { data } = await apiClient.get(`/search/suggestions-fetch/${userId}`);
  return data;
};

export { getSearchResults, storeSearchSuggestion, fetchSearchSuggestions };
