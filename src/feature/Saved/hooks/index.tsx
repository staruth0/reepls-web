import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { saveArticle, removeSavedArticle, getSavedArticles, getSavedArticle, getSavedPosts, getReadingHistory, updateReadingHistory, deleteReadingHistory } from "../api";

export const useSaveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => saveArticle(articleId),
    onSuccess: () => {
      // Invalidate saved articles query to refetch data in the background
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },
    onError: (error) => {
      void error;
    },
  });
};

export const useRemoveSavedArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => removeSavedArticle(articleId),
    onSuccess: () => {
      // Invalidate saved articles query to refetch data in the background
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },
    onError: (error) => {
      void error;
    },
  });
};

export const useGetSavedArticles = () => {
  return useQuery({
    queryKey: ["savedArticles"],
    queryFn: () => getSavedArticles(),
  });
};


export const useGetSavedPosts = () => {
  return useInfiniteQuery({
    queryKey: ["savedPosts"],
    queryFn: ({ pageParam = 1 }) => getSavedPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
     
      const postsFetched = allPages.length * 10; // Assumes 10 posts per page
      if (lastPage?.totalPosts && postsFetched < lastPage.totalPosts) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: true, 
  
  });
};

export const useGetSavedArticle = () => {
  return useInfiniteQuery({
    queryKey: ["savedArticles"],
    queryFn: ({ pageParam = 1 }) => getSavedArticle({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      
      const articlesFetched = allPages.length * 10; 
      if (lastPage?.totalArticles && articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: true, 
 
  });
};

// Hook for updating reading history
export const useUpdateReadingHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleSlug:string) => updateReadingHistory(articleSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingHistory"] });
    },
  });
};

// Hook for getting reading history
export const useGetReadingHistory = () => {
  return useQuery({
    queryKey: ["readingHistory"],
    queryFn: () => getReadingHistory(),
  });
};

// Hook for deleting reading history
export const useDeleteReadingHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleSlug:string) => deleteReadingHistory(articleSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingHistory"] });
    },
  });
};