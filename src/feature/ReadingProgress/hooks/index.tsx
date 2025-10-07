import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReadingProgress,
  getReadingProgressByArticleId,
  updateReadingProgress,
  deleteReadingProgress,
  getUserReadingProgress,
} from "../api";
import {
  CreateReadingProgressRequest,
  UpdateReadingProgressRequest,
  PaginationParams,
} from "../types";

// Hook to create reading progress
export const useCreateReadingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (readingProgress: CreateReadingProgressRequest) => 
      createReadingProgress(readingProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading-progress"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reading-progress"],
      });
    },
    onError: (error) => {
      console.error("Error creating reading progress:", error);
    },
  });
};

// Hook to get reading progress for a specific article
export const useGetReadingProgressByArticleId = (articleId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["reading-progress", articleId],
    queryFn: () => getReadingProgressByArticleId(articleId),
    enabled: enabled && !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to update reading progress
export const useUpdateReadingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, readingProgress }: { 
      articleId: string; 
      readingProgress: UpdateReadingProgressRequest; 
    }) => updateReadingProgress(articleId, readingProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reading-progress", variables.articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reading-progress"],
      });
    },
    onError: (error) => {
      console.error("Error updating reading progress:", error);
    },
  });
};

// Hook to delete reading progress
export const useDeleteReadingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => deleteReadingProgress(articleId),
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({
        queryKey: ["reading-progress", articleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reading-progress"],
      });
    },
    onError: (error) => {
      console.error("Error deleting reading progress:", error);
    },
  });
};


// Hook to get user's reading progress with regular pagination
export const useGetUserReadingProgressPaginated = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["user-reading-progress-paginated", params],
    queryFn: () => getUserReadingProgress(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
