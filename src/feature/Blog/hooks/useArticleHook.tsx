import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getFollowedArticles,
  getCommuniquerArticles,
} from "../api";
import { Article } from "../../../models/datamodels";
import { useNavigate } from "react-router-dom";

// Hook for creating an article
export const useCreateArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (article: Article) => createArticle(article),
    onSuccess: (data) => {
      console.log("Article created:", data);
      navigate("/articles");
    },
    onError: (error) => {
      console.error("Error creating article:", error);
    },
  });
};

// Hook for fetching a single article by ID
export const useGetArticleById = (articleId: string) => {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById(articleId),
   
  });
};

// Hook for fetching all articles
export const useGetAllArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => getAllArticles(),
    
  });
};

// Hook for fetching followed articles
export const useGetFollowedArticles = () => {
  return useQuery({
    queryKey: ["followed-articles"],
    queryFn: () => getFollowedArticles(),
  });
};

// Hook for fetching communique articles
export const useGetCommuniquerArticles = () => {
  return useQuery({
    queryKey: ["communiquer-articles"],
    queryFn: () => getCommuniquerArticles(),
  });
};

// Hook for updating an article
export const useUpdateArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      articleId,
      article,
    }: {
      articleId: string;
      article: Article;
    }) => updateArticle(articleId, article),
    onSuccess: (data, variables) => {
      console.log("Article updated:", data);
      navigate(`/articles/${variables.articleId}`);
    },
    onError: (error) => {
      console.error("Error updating article:", error);
    },
  });
};

// Hook for deleting an article
export const useDeleteArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (articleId: string) => deleteArticle(articleId),
    onSuccess: () => {
      console.log("Article deleted");
      navigate("/articles");
    },
    onError: (error) => {
      console.error("Error deleting article:", error);
    },
  });
};
