// hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSearchSuggestions, 
  getSearchResults, 
  storeSearchSuggestion,
  getPostResults,
  getArticleResults,
  getPeopleResults 
} from '../api';

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

export const useGetSearchSuggestions = (userId: string) => {
  return useQuery({
    queryKey: ['searchSuggestions'],
    queryFn: () => fetchSearchSuggestions(userId),
    enabled: !!userId,
  });
};

// New hooks
export const useGetPostResults = (query: string) => {
  return useQuery({
    queryKey: ['postResults', query],
    queryFn: () => getPostResults(query),
    enabled: !!query,
  });
};

export const useGetArticleResults = (query: string) => {
  return useQuery({
    queryKey: ['articleResults', query],
    queryFn: () => getArticleResults(query),
    enabled: !!query,
  });
};

export const useGetPeopleResults = (query: string) => {
  return useQuery({
    queryKey: ['peopleResults', query],
    queryFn: () => getPeopleResults(query),
    enabled: !!query,
  });
};