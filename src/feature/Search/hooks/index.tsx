import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSearchResults,
  storeSearchSuggestion,
  fetchSearchSuggestions,
} from "../api";

// Hook for fetching search results
export const useGetSearchResults = (query: string) => {
  return useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => getSearchResults(query),
  });
};

type SearchSuggestion = {
  userid: string;
  searchSuggestions: string;
}
// Hook for storing search suggestions
export const useStoreSearchSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (search: SearchSuggestion) => storeSearchSuggestion(search.userid,search.searchSuggestions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchSuggestions"],
      });
    },
  });
};

// Hook for fetching search suggestions
export const useGetSearchSuggestions = (userId: string) => {
  return useQuery({
    queryKey: ["searchSuggestions"],
    queryFn: () => fetchSearchSuggestions(userId),
  });
};
