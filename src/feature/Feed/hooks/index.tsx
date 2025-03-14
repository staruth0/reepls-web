import { useQuery } from '@tanstack/react-query';
import { getTrendingAuthors,getTrendingTopics } from '../api'; 

export const useGetTrendingAuthors = () => {
  return useQuery({
    queryKey: ['trending-authors'],
    queryFn: getTrendingAuthors,
  });
};


export const useGetTrendingTopics = () => {
  return useQuery({
    queryKey: ['trending-topics'] as const,
    queryFn: getTrendingTopics,
  });
};