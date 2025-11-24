import { apiClient } from "../../../services/apiClient"; 

const uploadStandalonePodcast = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries());
  console.log('--- FormData Contents ---', formDataObject);
  const { data } = await apiClient.post("/podcasts/standalone", formData /* no headers! */);
  return data;
};

const createArticleWithPodcast = async (formData: FormData) => {
  const { data } = await apiClient.post("/podcasts/create-with-article", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const attachPodcastToExistingArticle = async (articleId: string, formData: FormData) => {
  const { data } = await apiClient.post(`/podcasts/attach-to-article/${articleId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};


interface GetPodcastsParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPublic?: boolean;
  includePrivate?: boolean;
}

const getAllPodcasts = async (params?: GetPodcastsParams) => {
  const { data } = await apiClient.get("/podcasts", { params });
  return data;
};

const getPodcastsByUser = async (userId: string, params?: GetPodcastsParams) => {
  const { data } = await apiClient.get(`/podcasts/user/${userId}`, { params });
  return data;
};

const getPodcastById = async (podcastId: string) => {
  const { data } = await apiClient.get(`/podcasts/${podcastId}`);
  return data;
};

const searchPodcasts = async (query: string, params?: GetPodcastsParams) => {
  const { data } = await apiClient.get(`/podcasts/search?q=${query}`, { params });
  return data;
};

interface GetPopularPodcastsParams {
  page?: number;
  limit?: number;
  timeframe?: string;
}

const getPopularPodcasts = async (params?: GetPopularPodcastsParams) => {
  const { data } = await apiClient.get("/podcasts/popular", { params });
  return data;
};

interface GetSuggestedPodcastsParams {
  page?: number;
  limit?: number;
}

const getSuggestedPodcasts = async (params?: GetSuggestedPodcastsParams) => {
  const { data } = await apiClient.get("/podcasts/suggested", { params });
  return data;
};

// --- Podcast Updates ---

interface UpdatePodcastMetadataPayload {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
}

const updatePodcastMetadata = async (podcastId: string, payload: UpdatePodcastMetadataPayload) => {
  const { data } = await apiClient.put(`/podcasts/${podcastId}`, payload);
  return data;
};

const updatePodcastAudio = async (podcastId: string, formData: FormData) => {
  const { data } = await apiClient.put(`/podcasts/${podcastId}/audio`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// --- Podcast Play Tracking ---

interface TrackPodcastPlayPayload {
  userId?: string; // Optional for anonymous users
  playedDuration: number;
  totalDuration: number;
}

const trackPodcastPlay = async (podcastId: string, payload: TrackPodcastPlayPayload) => {
  const { data } = await apiClient.post(`/podcasts/${podcastId}/play`, payload);
  return data;
};

// --- Podcast Deletion ---

const deletePodcast = async (podcastId: string) => {
  const { data } = await apiClient.delete(`/podcasts/${podcastId}`);
  return data;
};

// --- Duplicate Podcast Management (Admin) ---

const getDuplicateStats = async () => {
  const { data } = await apiClient.get("/podcasts/admin/duplicate-stats");
  return data;
};

interface GetDuplicateGroupsParams {
  limit?: number;
}

const getDuplicateGroups = async (params?: GetDuplicateGroupsParams) => {
  const { data } = await apiClient.get("/podcasts/admin/duplicate-groups", { params });
  return data;
};

const getUserDuplicateReport = async () => {
  const { data } = await apiClient.get("/podcasts/user/duplicate-report/self");
  return data;
};

// --- Podcast Commenting ---

interface AddCommentPayload {
  content: string;
  isAudioComment: boolean;
  audioUrl?: string; // Required if isAudioComment is true
  audioDuration?: number; // Required if isAudioComment is true
  parentCommentId?: string; // For replies
}

const addCommentToPodcast = async (podcastId: string, payload: AddCommentPayload) => {
  const { data } = await apiClient.post(`/podcasts/${podcastId}/comments`, payload);
  return data;
};

const addReplyToComment = async (podcastId: string, payload: AddCommentPayload) => {
  // Assuming the same endpoint is used for adding replies as comments,
  // with parentCommentId in the payload.
  const { data } = await apiClient.post(`/podcasts/${podcastId}/comments`, payload);
  return data;
};


interface GetCommentsParams {
  page?: number;
  limit?: number;
  parentId?: string; // For getting replies
}

const getPodcastComments = async (podcastId: string, params?: GetCommentsParams) => {
  console.log('id passed', podcastId)
  const { data } = await apiClient.get(`/podcasts/${podcastId}/comments`, { params });
  return data;
};

const getCommentReplies = async (podcastId: string, parentId: string, params?: GetCommentsParams) => {
  // The document shows `parentid` in query, but typically `parentId` is used for consistency.
  // Using `parentId` here for clarity.
  const { data } = await apiClient.get(`/podcasts/${podcastId}/comments`, { params: { ...params, parentId } });
  return data;
};

interface UpdateCommentPayload {
  content: string;
}

const updateComment = async (commentId: string, payload: UpdateCommentPayload) => {
  const { data } = await apiClient.put(`/podcasts/comments/${commentId}`, payload);
  return data;
};

const deleteComment = async (commentId: string) => {
  const { data } = await apiClient.delete(`/podcasts/comments/${commentId}`);
  return data;
};

// --- Saved Podcast Library Management ---

interface SavePodcastPayload {
  playlistCategory: string;
  personalNotes?: string;
  rating?: number;
  tags?: string[];
}

const savePodcastToLibrary = async (podcastId: string, payload: SavePodcastPayload) => {
  const { data } = await apiClient.post(`/podcasts/${podcastId}/save`, payload);
  return data;
};

const removePodcastFromLibrary = async (podcastId: string) => {
  const { data } = await apiClient.delete(`/podcasts/${podcastId}/save`);
  return data;
};

interface UpdateSavedPodcastMetadataPayload {
  playlistCategory?: string;
  personalNotes?: string;
  rating?: number;
  tags?: string[];
  currentPosition?: number;
  totalDuration?: number;
  isCompleted?: boolean;
}

const updateSavedPodcastMetadata = async (podcastId: string, payload: UpdateSavedPodcastMetadataPayload) => {
  const { data } = await apiClient.put(`/podcasts/${podcastId}/save`, payload);
  return data;
};

interface GetSavedPodcastsParams {
  page?: number;
  limit?: number;
  category?: string;
  rating?: number;
}

const getMySavedPodcasts = async (params?: GetSavedPodcastsParams) => {
  const { data } = await apiClient.get("/podcasts/self/saved", { params });
  return data;
};

const getSavedPodcastsByCategory = async (category: string, params?: GetSavedPodcastsParams) => {
  const { data } = await apiClient.get(`/podcasts/self/saved?category=${category}`, { params });
  return data;
};

const getSavedPodcastsByRating = async (rating: number, params?: GetSavedPodcastsParams) => {
  const { data } = await apiClient.get(`/podcasts/self/saved?rating=${rating}`, { params });
  return data;
};

// --- Podcast Listen Tracking (Authenticated & Anonymous) ---

interface TrackListenPayload {
  playedDuration: number;
  totalDuration: number;
  completed: boolean;
  timestamp: string;
}

const trackPodcastListenAuthenticated = async (podcastId: string, payload: TrackListenPayload) => {
  const { data } = await apiClient.post(`/podcasts/${podcastId}/listen`, payload);
  return data;
};

const trackPodcastListenAnonymous = async (podcastId: string, payload: TrackListenPayload) => {
  const { data } = await apiClient.post(`/podcasts/${podcastId}/listen`, payload);
  return data;
};


export {
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
  addReplyToComment,
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
};