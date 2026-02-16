import { Article, MediaItem, User } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";


interface RepostArticlePayload {
  comment?: string; 
}

export interface UpdateRepostPayload {
  comment: string;
}

// Response interfaces for the actual API
export interface RepostResponse {
  id: string;
  user: string | User;
  article: string | RepostArticleDetail;
  comment: string;
  repostedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepostResponse {
  message: string;
  reposted: boolean;
  repost: RepostResponse;
}

export interface GetMyRepostsResponse {
  reposts: Article[];
  totalReposts: number;
  totalPages: number;
}

export interface UpdateRepostResponse {
  message: string;
  repost: RepostResponse;
}

export interface DeleteRepostResponse {
  message: string;
}

export interface CleanupOrphanedResponse {
  message: string;
  deletedCount: number;
}

/**
 * Creates a new repost for a specific article.
 * @param articleId The ID of the article to repost.
 * @param payload An object containing the optional comment.
 * @returns The response data from the API.
 */
export const repostArticle = async (articleId: string, payload: RepostArticlePayload): Promise<CreateRepostResponse> => {
  const { data } = await apiClient.post(`/reposts/article/${articleId}`, payload);
  return data;
};

/**
 * Updates the comment on a specific repost.
 * @param repostId The ID of the repost to update.
 * @param payload An object containing the new comment.
 * @returns The response data from the API.
 */
export const updateRepost = async (repostId: string, payload: UpdateRepostPayload): Promise<UpdateRepostResponse> => {
  const { data } = await apiClient.put(`/reposts/${repostId}/comment`, payload);
  return data;
};

/**
 * Deletes a specific repost.
 * @param repostId The ID of the repost to delete.
 * @returns The response data from the API.
 */
export const deleteRepost = async (repostId: string): Promise<DeleteRepostResponse> => {
  console.log("Deleting repost with ID:", repostId);
  // Ensure the repostId is valid before making the API call
  if (!repostId) {
    throw new Error("Repost ID is required for deletion");
  }
  const { data } = await apiClient.delete(`/reposts/${repostId}`);
  return data;
};

/**
 * Retrieves paginated list of reposts created by a specific user.
 * @param userId The ID of the user whose reposts to retrieve.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of reposts per page (default: 10).
 * @returns The paginated reposts data.
 */
export const getMyReposts = async (userId: string, page: number = 1, limit: number = 10): Promise<GetMyRepostsResponse> => {
  const { data } = await apiClient.get(`/reposts/my/${userId}?page=${page}&limit=${limit}`);
  return data;
};

/**
 * Administrative endpoint to clean up orphaned reposts.
 * @returns The cleanup response data.
 */
export const cleanupOrphanedReposts = async (): Promise<CleanupOrphanedResponse> => {
  const { data } = await apiClient.post('/reposts/cleanup-orphaned');
  return data;
};



export interface AddCommentToRepostPayload {
  content: string;
  parent_comment_id?: string; 
}

export interface RepostComment {
  content: string;
  is_audio_comment: boolean;
  targetType: string;
  targetId: string;
  author_id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  v: number;
}

export interface CommentAuthor {
  _id: string;
  username: string;
  name: string;
  email: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  role: string;
  profile_picture: string | null;
  banner_picture: string | null;
  interests: string[];
  searchHistory: string[];
  is_verified_writer: boolean;
   interactionHistory?: {
    categories: string[];
    likedArticles: string[];
    viewedArticles: string[];
  };
  categories: string[];
  likedArticles: string[];
  viewedArticles: string[];
  readArticles: string[];
  createdAt: string;
  updatedAt: string;
  v: number;
  CanMakecommuniquer: boolean;
  repostHistory: {
    reposted_articles: string[];
    reposted_posts: string[];
  };
}

export interface RepostCommentNode {
  _id: string;
  content: string;
  is_audio_comment: boolean;
  targetType: string;
  targetId: string;
  author_id: string;
  createdAt: string;
  updatedAt: string;
  v: number;
  author: CommentAuthor;
  isMainComment: boolean;
  replies: RepostCommentNode[];
}

export interface GetCommentsTreeResponse {
  message: string;
  data: {
    commentsTree: RepostCommentNode[];
    totalPages: number;
    parentCommentsCount: number;
    totalComments: number;
  };
}

export interface RepostArticleDetail {
  _id: string;
  title: string;
  content: string;
  is_communiquer: boolean;
  isArticle: boolean;
  keywords: string[];
  author_id: User;
  status: string;
  flagged: boolean;
  views_count: number;
  reports_count: number;
  shares_count: number;
  reaction_count: number;
  comment_count: number;
  impression_count: number;
  engagement_count: number;
  author_follower_count: number;
  author_profile_views_count: number;
  hasPodcast: boolean;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  v: number;
  text_to_speech?: string;
  type?: string;
  subtitle?: string;
  category?: string;
  thumbnail?: string;
}

export interface MyRepost {
  _id: string;
  user: User;
  article: RepostArticleDetail;
  shares_count: number;
  comment: string;
  repostedAt: string;
  v: number;
  type: string;
  reposted: boolean;
}

export interface GetMyRepostsResponse {
  reposts: Article[];
}

// Interfaces for Reactions APIs
export type ReactionType = "like" | "dislike" | "love" | "clap" | "insightful";
export type TargetType = "Article" | "Comment" | "Repost" | "Podcast";

export interface CreateUpdateReactionPayload {
  target_id: string;
  target_type: TargetType;
  type: string;
}

export interface ReactionResponseData {
  _id: string;
  type: string;
  user_id: string;
  target_id: string;
  target_type: TargetType;
  createdAt: string;
  updatedAt: string;
  v: number;
}

export interface UpdateReactionPayload {
  type:  string; // Allow string for flexibility
}

export interface GetAllReactionsForTargetResponse {
  reactions: ReactionResponseData[];
  totalReactions: number;
  totalPages: number;
}

export interface ReactionGroupedUsers {
  users: CommentAuthor[];
  totalUsers: number;
  totalPages: number;
}

export interface GetReactionsGroupedByTypeResponse {
  [key: string]: ReactionGroupedUsers;
}

// Interfaces for Shares APIs
export type ShareTargetType = "Article" | "Repost";

export interface ShareResponse {
  message: string;
  shares_count: number;
}




/**
 * Adds a text comment to a specific repost.
 * @param repostId The ID of the repost to comment on.
 * @param payload An object containing the comment content.
 * @returns The response data from the API, containing the new comment.
 */
export const addCommentToRepost = async (
  repostId: string,
  payload: AddCommentToRepostPayload
): Promise<RepostComment> => {
  const { data } = await apiClient.post(`/reposts/${repostId}/comments`, payload);
  return data.data;
};



/**
 * Fetches paginated comments for a repost, organized in a tree structure.
 * @param repostId The ID of the repost.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of comments per page (default: 10).
 * @returns The comments tree data.
 */
export const getCommentsTreeForRepost = async (
  repostId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetCommentsTreeResponse["data"]> => {
  const { data } = await apiClient.get(
    `/reposts/${repostId}/comments?page=${page}&limit=${limit}`
  );
  return data.data;
};







/**
 * Creates a new reaction or updates an existing one.
 * @param payload An object containing target_id, target_type, and type of reaction.
 * @returns The newly created or updated reaction data.
 */
export const createUpdateReaction = async (
  payload: CreateUpdateReactionPayload
): Promise<ReactionResponseData> => {
  const { data } = await apiClient.post("/react", payload);
  return data.data;
};



/**
 * Retrieves a user's reaction to a specific target (Article, Comment, or Repost).
 * @param target_type The type of the target (e.g., "Article", "Comment", "Repost").
 * @param target_id The ID of the target.
 * @returns The user's reaction data for the target.
 */
export const getReactionByTarget = async (
  target_type: TargetType,
  target_id: string
): Promise<ReactionResponseData> => {
  const { data } = await apiClient.get(
    `/reactions/by-target/${target_type}/${target_id}`
  );
  return data.data;
};



/**
 * Retrieves the details of a reaction using its unique ID.
 * @param reactionId The ID of the reaction.
 * @returns The reaction's details.
 */
export const getReactionById = async (
  reactionId: string
): Promise<ReactionResponseData> => {
  const { data } = await apiClient.get(`/reactions/${reactionId}`);
  return data.data;
};



/**
 * Modifies an existing reaction's type.
 * @param reactionId The ID of the reaction to update.
 * @param payload An object containing the new reaction type.
 * @returns The updated reaction data.
 */
export const updateReaction = async (
  reactionId: string,
  payload: UpdateReactionPayload
): Promise<ReactionResponseData> => {
  const { data } = await apiClient.put(`/reactions/${reactionId}`, payload);
  return data.data;
};



/**
 * Removes a reaction using its unique ID.
 * @param reactionId The ID of the reaction to delete.
 */
export const deleteReaction = async (reactionId: string): Promise<void> => {
  await apiClient.delete(`/reactions/${reactionId}`);
};



/**
 * Retrieves all reactions associated with a specific target with pagination.
 * @param target_type The type of the target.
 * @param id The ID of the target.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of reactions per page (default: 10).
 * @returns A list of reactions and pagination info for the target.
 */
export const getAllReactionsForTarget = async (
  target_type: TargetType,
  id: string,
  page: number = 1,
  limit: number = 10
) => {
   console.log('target-type',target_type, 'id',id)
  const { data } = await apiClient.get(
 
    `/react/${target_type}/${id}/reactions?page=${page}&limit=${limit}`
  );

console.log('API response data:', data);
return data; 

  return data.data;
};



/**
 * Retrieves users grouped by their reaction type for a specific target.
 * @param target_type The type of the target.
 * @param id The ID of the target.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of results per page (default: 10).
 * @returns An object with reactions grouped by type, each containing users and pagination info.
 */
export const getReactionsGroupedByType = async (
  target_type: TargetType,
  id: string,
  page: number = 1,
  limit: number = 10
) => {
  const { data } = await apiClient.get(
    `/react/${target_type}/${id}/reactions/per-type?page=${page}&limit=${limit}`
  );
  return data.data;
};



/**
 * Updates the share_count when an article or repost is shared.
 * @param target_type The type of the target (Article or Repost).
 * @param id The ID of the article or repost.
 * @returns The response containing a message and the updated shares_count.
 */
export const shareTarget = async (
  target_type: ShareTargetType,
  id: string
): Promise<ShareResponse> => {
  const { data } = await apiClient.post(`/share/${target_type}/${id}`);
  return data;
};


// Get all repost comments
export const getAllRepostComments = async ({ page = 1, limit = 10 }) => {
  const res = await apiClient.get(`/reposts/comments/all`, {
    params: { page, limit },
  });
  return res.data;
};

// Get comments by repost ID
export const getCommentsByRepostId = async (repostId:string) => {
  const res = await apiClient.get(`/reposts/${repostId}/comment/by-repost`);
  return res.data;
};


export interface SaveRepostResponse {
  message: string;
  savedRepost: RepostResponse;
}

export interface RemoveSavedRepostResponse {
  message: string;
}

export interface GetSavedRepostsResponse {
  reposts: RepostResponse[];
  totalReposts: number;
  totalPages: number;
}

export interface RepostCountResponse {
  message: string;
  data: {
    articleId: string;
    articleTitle: string;
    repostCount: number;
    actualRepostCount: number;
    isCountAccurate: boolean;
  };
}

/**
 * Saves a repost.
 * @param repostId The ID of the repost to save.
 * @returns The response data from the API.
 */
export const saveRepost = async (repostId: string)=> {
  const { data } = await apiClient.post(`/articles/saved-repost/${repostId}`);
  return data;
};

/**
 * Removes a saved repost.
 * @param repostId The ID of the saved repost to remove.
 * @returns The response data from the API.
 */
export const removeSavedRepost = async (repostId: string) => {
  const { data } = await apiClient.delete(`/articles/saved-repost/${repostId}`);
  return data;
};

/**
 * Retrieves a paginated list of saved reposts for the authenticated user.
 * @param page The page number for pagination (default: 1).
 * @param limit The number of saved reposts per page (default: 10).
 * @returns The paginated saved reposts data.
 */
export const getSavedReposts = async (page: number = 1, limit: number = 10) => {
  const { data } = await apiClient.get(`/articles/saved-reposts?page=${page}&limit=${limit}`);
  return data;
};

/**
 * Retrieves the repost count for a specific article.
 * @param articleId The ID of the article to get repost count for.
 * @returns The repost count data including accuracy information.
 */
export const getRepostCount = async (articleId: string): Promise<RepostCountResponse> => {
  const { data } = await apiClient.get(`/reposts/article/${articleId}/count`);
  return data;
};

// New interface for the simplified repost count response
export interface SimpleRepostCountResponse {
  success: boolean;
  articleId: string;
  repostCount: number;
  message: string;
}

/**
 * Retrieves the repost count for a specific article using the new endpoint.
 * @param articleId The ID of the article to get repost count for.
 * @returns The simplified repost count data.
 */
export const getRepostCountSimple = async (articleId: string): Promise<SimpleRepostCountResponse> => {
  const { data } = await apiClient.get(`/reposts/count/${articleId}`);
  return data;
};