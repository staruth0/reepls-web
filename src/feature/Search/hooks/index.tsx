import { useQuery } from "@tanstack/react-query";
import { getSearchResults } from "../api";

// Hook for fetching search results
export const useGetSearchResults = (query: string) => {
  return useQuery({
    queryKey: ["searchResults", query], 
    queryFn: () => getSearchResults(query),
  
  });
};
