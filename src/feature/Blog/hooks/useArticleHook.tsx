import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createArticle,
  getArticleById,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getFollowedArticles,
  getCommuniquerArticles,
  getArticleByAuthorId,
  getRecommendedArticles,
  getArticlesByCategory,
} from "../api";
import { Article } from "../../../models/datamodels";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { useEffect } from "react"; // Import useEffect

// Hook for creating an article
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (article: Article) => createArticle(article),
    onSuccess: (data) => {
      console.log("Article created:", data);
      // Invalidate the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
      toast.success("Article created successfully!", { position: "top-right" }); // Success toast
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error creating article. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error creating article:", error);
    },
  });
};

// Hook for fetching a single article by ID
export const useGetArticleById = (articleId: string) => {
  const query = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById(articleId),
  });

  useEffect(() => {
    if (query.isError) {
      const errorMessage = query.error?.response?.data?.message || "Error fetching article. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error fetching article:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching articles by an author with ID
export const useGetArticlesByAuthorId = (authorId: string) => {
  const query = useQuery({
    queryKey: ["articles-by-author", authorId],
    queryFn: () => getArticleByAuthorId(authorId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching articles by author:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching all articles
export const useGetAllArticles = () => {
  const query = useQuery({
    queryKey: ["articles"],
    queryFn: () => getAllArticles(),
  });

  useEffect(() => {
    if (query.isError) {
      const errorMessage = query.error?.response?.data?.message || "Error fetching articles. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error fetching articles:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching followed articles
export const useGetFollowedArticles = () => {
  const query = useQuery({
    queryKey: ["followed-articles"],
    queryFn: () => getFollowedArticles(),
  });

  useEffect(() => {
    if (query.isError) {
      const errorMessage = query.error?.response?.data?.message || "Error fetching followed articles. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error fetching followed articles:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching communique articles
export const useGetCommuniquerArticles = () => {
  const query = useQuery({
    queryKey: ["communiquer-articles"],
    queryFn: () => getCommuniquerArticles(),
  });

  useEffect(() => {
    if (query.isError) {
      const errorMessage = query.error?.response?.data?.message || "Error fetching communique articles. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error fetching communique articles:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching recommended articles
export const useGetRecommendedArticles = () => {
  const query = useQuery({
    queryKey: ["recommended-articles"],
    queryFn: () => getRecommendedArticles(),
  });

  useEffect(() => {
    if (query.isError) {
      const errorMessage = query.error?.response?.data?.message || "Error fetching recommended articles. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error fetching recommended articles:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for fetching articles by category
export const useGetArticlesByCategory = (category: string) => {
  const query = useQuery({
    queryKey: ["articles-by-category", category],
    queryFn: () => getArticlesByCategory(category),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching articles by category:", query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

// Hook for updating an article
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
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
      // Invalidate the "article" and "articles" queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["article", variables.articleId],
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate(`/articles/${variables.articleId}`);
      toast.success("Article updated successfully!", { position: "top-right" }); // Success toast
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error updating article. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error updating article:", error);
    },
  });
};

// Hook for deleting an article
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (articleId: string) => deleteArticle(articleId),
    onSuccess: () => {
      console.log("Article deleted");
      // Invalidate the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
      toast.success("Article deleted successfully!", { position: "top-right" }); // Success toast
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error deleting article. Please try again.";
      toast.error(errorMessage, { position: "top-right" }); // Error toast
      console.error("Error deleting article:", error);
    },
  });
};