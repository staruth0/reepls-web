import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { saveArticle, removeSavedArticle, getSavedArticles, getSavedArticle, getSavedPosts } from "../api";

export const useSaveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => saveArticle(articleId),
    onSuccess: (data) => {
      console.log("Article saved:", data);
      // Invalidate saved articles query to refetch data in the background
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },
    onError: (error) => {
      console.error("Error saving article:", error);
    },
  });
};

export const useRemoveSavedArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => removeSavedArticle(articleId),
    onSuccess: (data) => {
      console.log("Article removed from saved:", data);
      // Invalidate saved articles query to refetch data in the background
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },
    onError: (error) => {
      console.error("Error removing saved article:", error);
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
      console.log('saved lastpage posts', lastPage);
      console.log('saved allpage posts', allPages);
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
      console.log('saved lastpage aricles', lastPage);
      console.log('saved allpage articles', allPages);
      const articlesFetched = allPages.length * 10; 
      if (lastPage?.totalArticles && articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: true, 
 
  });
};