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

// Hook for storing search suggestions
export const useStoreSearchSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      searchSuggestion,
    }: {
      userId: string;
      searchSuggestion: string;
    }) => storeSearchSuggestion(userId, searchSuggestion),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["searchSuggestions", userId],
      });
    },
  });
};

// Hook for fetching search suggestions
export const useGetSearchSuggestions = (userId: string) => {
  return useQuery({
    queryKey: ["searchSuggestions", userId],
    queryFn: () => fetchSearchSuggestions(userId),
  });
};
