import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSearchSuggestions, getSearchResults, storeSearchSuggestion } from '../api';

// Hook for fetching search results
export const useGetSearchResults = (query: string) => {
  return useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => getSearchResults(query),
    enabled: !!query,
  });
};

type SearchSuggestion = {
  userid: string;
  searchSuggestions: string;
};
// Hook for storing search suggestions
export const useStoreSearchSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (search: SearchSuggestion) => storeSearchSuggestion(search.userid, search.searchSuggestions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['searchSuggestions'],
      });
    },
    onError: (error) => {
      console.error('Error storing search suggestion:', error);
    },
  });
};

// Hook for fetching search suggestions
export const useGetSearchSuggestions = (userId: string) => {
  return useQuery({
    queryKey: ['searchSuggestions'],
    queryFn: () => fetchSearchSuggestions(userId),
    enabled: !!userId,
  });
};
