import { apiClient } from "../../../services/apiClient";

// Fetch search results from the backend API
const getSearchResults = async (query: string) => {
  console.log("query string:", query);
  const { data } = await apiClient.get(`/search/result?searchQuery=${query}`); 
  return data;
};

export { getSearchResults };
