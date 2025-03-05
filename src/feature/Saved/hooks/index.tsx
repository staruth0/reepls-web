import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saveArticle, removeSavedArticle, getSavedArticles } from "../api";

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
