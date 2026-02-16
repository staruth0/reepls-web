import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  uploadStandalonePodcast,
  createArticleWithPodcast,
  attachPodcastToExistingArticle,
  getAllPodcasts,
  getPodcastsByUser,
  getPodcastById,
  searchPodcasts,
  getPopularPodcasts,
  getSuggestedPodcasts,
  updatePodcastMetadata,
  updatePodcastAudio,
  trackPodcastPlay,
  deletePodcast,
  getDuplicateStats,
  getDuplicateGroups,
  getUserDuplicateReport,
  addCommentToPodcast,
  getPodcastComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  savePodcastToLibrary,
  removePodcastFromLibrary,
  updateSavedPodcastMetadata,
  getMySavedPodcasts,
  getSavedPodcastsByCategory,
  getSavedPodcastsByRating,
  trackPodcastListenAuthenticated,
  trackPodcastListenAnonymous,
  checkIfPodcastIsSaved,
} from '../api'; 



export const useUploadStandalonePodcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadStandalonePodcast(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
};

export const useCreateArticleWithPodcast = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: createArticleWithPodcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] }); 
    },
  });
};

export const useAttachPodcastToExistingArticle = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ articleId, formData }: { articleId: string, formData: FormData }) => attachPodcastToExistingArticle(articleId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
      queryClient.invalidateQueries({ queryKey: ['article', variables.articleId] }); // Invalidate specific article
    },
  });
};



interface UseGetAllPodcastsParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPublic?: boolean;
  includePrivate?: boolean;
}

export const useGetAllPodcasts = (params?: UseGetAllPodcastsParams) => {
  return useQuery({
    queryKey: ['podcasts', params] as const,
    queryFn: () => getAllPodcasts(params),
  });
};

// Infinite query hook for podcasts with pagination
export const useGetAllPodcastsInfinite = (params?: Omit<UseGetAllPodcastsParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['podcasts', 'infinite', params] as const,
    queryFn: ({ pageParam = 1 }) => getAllPodcasts({ ...params, page: pageParam }),
    initialPageParam: 1,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      // Based on your data structure: {success: true, data: {limit: 10, page: 1, results: [...], totalPages: 4, totalResults: 39}}
      const currentPage = allPages.length;
      const totalPages = lastPage?.data?.totalPages;
      
      if (totalPages && currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // No more pages
    },
  });
};

interface UseGetPodcastsByUserParams extends UseGetAllPodcastsParams {
  userId: string;
}

export const useGetPodcastsByUser = (params: UseGetPodcastsByUserParams) => {
  return useQuery({
    queryKey: ['podcasts', 'user', params.userId, params] as const,
    queryFn: () => getPodcastsByUser(params.userId, params),
    enabled: !!params.userId,
  });
};

export const useGetPodcastById = (podcastId: string) => {
  return useQuery({
    queryKey: ['podcast', podcastId] as const,
    queryFn: () => getPodcastById(podcastId),
    enabled: !!podcastId,
  });
};

interface UseSearchPodcastsParams extends UseGetAllPodcastsParams {
  q: string;
}

export const useSearchPodcasts = (params: UseSearchPodcastsParams) => {
  return useQuery({
    queryKey: ['podcasts', 'search', params.q, params] as const,
    queryFn: () => searchPodcasts(params.q, params),
    enabled: !!params.q,
  });
};

interface UseGetPopularPodcastsParams {
  page?: number;
  limit?: number;
  timeframe?: string;
}

export const useGetPopularPodcasts = (params?: UseGetPopularPodcastsParams) => {
  return useQuery({
    queryKey: ['podcasts', 'popular', params] as const,
    queryFn: () => getPopularPodcasts(params),
  });
};

interface UseGetSuggestedPodcastsParams {
  page?: number;
  limit?: number;
}

export const useGetSuggestedPodcasts = (params?: UseGetSuggestedPodcastsParams) => {
  return useQuery({
    queryKey: ['podcasts', 'suggested', params] as const,
    queryFn: () => getSuggestedPodcasts(params),
  });
};

// --- Podcast Updates Mutations ---

interface UseUpdatePodcastMetadataPayload {
  podcastId: string;
  payload: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    isPublic?: boolean;
  };
}

export const useUpdatePodcastMetadata = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseUpdatePodcastMetadataPayload) => updatePodcastMetadata(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] });
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
};

interface UseUpdatePodcastAudioPayload {
  podcastId: string;
  formData: FormData;
}

export const useUpdatePodcastAudio = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ podcastId, formData }: UseUpdatePodcastAudioPayload) => updatePodcastAudio(podcastId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] });
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
};

// --- Podcast Play Tracking Mutation ---

interface UseTrackPodcastPlayPayload {
  podcastId: string;
  payload: {
    userId?: string;
    playedDuration: number;
    totalDuration: number;
  };
}

export const useTrackPodcastPlay = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseTrackPodcastPlayPayload) => trackPodcastPlay(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] });
      // You might also want to refetch popular podcasts or user-specific listen data.
    },
  });
};

// --- Podcast Deletion Mutation ---

export const useDeletePodcast = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: deletePodcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] });
    },
  });
};



export const useGetDuplicateStats = () => {
  return useQuery({
    queryKey: ['admin', 'duplicate-stats'] as const,
    queryFn: getDuplicateStats,
  });
};

interface UseGetDuplicateGroupsParams {
  limit?: number;
}

export const useGetDuplicateGroups = (params?: UseGetDuplicateGroupsParams) => {
  return useQuery({
    queryKey: ['admin', 'duplicate-groups', params] as const,
    queryFn: () => getDuplicateGroups(params),
  });
};

export const useGetUserDuplicateReport = () => {
  return useQuery({
    queryKey: ['user', 'duplicate-report', 'self'] as const,
    queryFn: getUserDuplicateReport,
  });
};

// --- Podcast Commenting Mutations & Queries ---

interface UseAddCommentPayload {
  podcastId: string;
  payload: {
    content: string;
    isAudioComment: boolean;
    audioUrl?: string;
    audioDuration?: number;
    parentCommentId?: string;
  };
}

export const useAddCommentToPodcast = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseAddCommentPayload) => addCommentToPodcast(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] }); // To update comment count
    },
  });
};

export const useAddReplyToComment = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseAddCommentPayload) => addCommentToPodcast(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId, 'comments'] });
      if (variables.payload.parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId, 'comments', variables.payload.parentCommentId, 'replies'] });
      }
    },
  });
};

interface UseGetPodcastCommentsParams {
  podcastId: string;
  page?: number;
  limit?: number;
}

export const useGetPodcastComments = (params: UseGetPodcastCommentsParams) => {
  return useQuery({
    queryKey: ['podcast', params.podcastId, 'comments', params] as const,
    queryFn: () => getPodcastComments(params.podcastId, params),
    enabled: !!params.podcastId,
  });
};

interface UseGetCommentRepliesParams {
  podcastId: string;
  parentId: string;
  page?: number;
  limit?: number;
}

export const useGetCommentReplies = (params: UseGetCommentRepliesParams) => {
  return useQuery({
    queryKey: ['podcast', params.podcastId, 'comments', params.parentId, 'replies', params] as const,
    queryFn: () => getCommentReplies(params.podcastId, params.parentId, params),
    enabled: !!params.podcastId && !!params.parentId,
  });
};

interface UseUpdateCommentPayload {
  commentId: string;
  payload: { content: string };
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ commentId, payload }: UseUpdateCommentPayload) => updateComment(commentId, payload),
    onSuccess: () => {
      // Invalidate specific comment or its parent query
      queryClient.invalidateQueries({ queryKey: ['podcast', 'comments'] }); // More general invalidation
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcast', 'comments'] });
    },
  });
};



interface UseSavePodcastPayload {
  podcastId: string;
  payload: {
    playlistCategory: string;
    personalNotes?: string;
    rating?: number;
    tags?: string[];
  };
}

export const useSavePodcastToLibrary = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseSavePodcastPayload) => savePodcastToLibrary(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['saved-podcasts', 'self'] });
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId, 'is-saved'] });
    },
  });
};

export const useRemovePodcastFromLibrary = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: (podcastId: string) => removePodcastFromLibrary(podcastId),
    onSuccess: (_, podcastId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-podcasts', 'self'] });
      queryClient.invalidateQueries({ queryKey: ['podcast', podcastId, 'is-saved'] });
    },
  });
};

interface UseUpdateSavedPodcastMetadataPayload {
  podcastId: string;
  payload: {
    playlistCategory?: string;
    personalNotes?: string;
    rating?: number;
    tags?: string[];
    currentPosition?: number;
    totalDuration?: number;
    isCompleted?: boolean;
  };
}

export const useUpdateSavedPodcastMetadata = () => {
  const queryClient = useQueryClient(); // Correct placement
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseUpdateSavedPodcastMetadataPayload) => updateSavedPodcastMetadata(podcastId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-podcasts', 'self'] });
    },
  });
};

interface UseGetMySavedPodcastsParams {
  page?: number;
  limit?: number;
}

export const useGetMySavedPodcasts = (params?: UseGetMySavedPodcastsParams) => {
  return useQuery({
    queryKey: ['saved-podcasts', 'self', params] as const,
    queryFn: () => getMySavedPodcasts(params),
  });
};

export const useCheckIfPodcastIsSaved = (podcastId: string | undefined) => {
  return useQuery({
    queryKey: ['podcast', podcastId, 'is-saved'] as const,
    queryFn: () => checkIfPodcastIsSaved(podcastId!),
    enabled: !!podcastId,
  });
};

interface UseGetSavedPodcastsByCategoryParams extends UseGetMySavedPodcastsParams {
  category: string;
}

export const useGetSavedPodcastsByCategory = (params: UseGetSavedPodcastsByCategoryParams) => {
  return useQuery({
    queryKey: ['saved-podcasts', 'self', 'category', params.category, params] as const,
    queryFn: () => getSavedPodcastsByCategory(params.category, params),
    enabled: !!params.category,
  });
};

interface UseGetSavedPodcastsByRatingParams extends UseGetMySavedPodcastsParams {
  rating: number;
}

export const useGetSavedPodcastsByRating = (params: UseGetSavedPodcastsByRatingParams) => {
  return useQuery({
    queryKey: ['saved-podcasts', 'self', 'rating', params.rating, params] as const,
    queryFn: () => getSavedPodcastsByRating(params.rating, params),
    enabled: !!params.rating,
  });
};

// --- Podcast Listen Tracking Mutations ---

interface UseTrackPodcastListenPayload {
  podcastId: string;
  payload: {
    playedDuration: number;
    totalDuration: number;
    completed: boolean;
    timestamp: string;
  };
}

export const useTrackPodcastListenAuthenticated = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseTrackPodcastListenPayload) => trackPodcastListenAuthenticated(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] });
      queryClient.invalidateQueries({ queryKey: ['saved-podcasts', 'self'] }); 
    },
  });
};

export const useTrackPodcastListenAnonymous = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: ({ podcastId, payload }: UseTrackPodcastListenPayload) => trackPodcastListenAnonymous(podcastId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['podcast', variables.podcastId] });
    },
  });
};