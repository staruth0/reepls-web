import { MediaItem, User } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";


interface RepostArticlePayload {
  comment?: string; 
}

export interface UpdateRepostPayload {
  comment: string;
}

/**
 * Repost an article for the user.
 * @param articleId The ID of the article to repost.
 * @param payload An object containing the optional comment.
 * @returns The response data from the API.
 */

export const repostArticle = async (articleId: string, payload: RepostArticlePayload) => {
  const { data } = await apiClient.post(`/reposts/article/${articleId}`, payload);
  return data;
};

/**
 * Update a repost commentary.
 * @param repostId The ID of the repost to update.
 * @param payload An object containing the new comment.
 * @returns The response data from the API.
 */
export const updateRepost = async (repostId: string, payload: UpdateRepostPayload) => {
  const { data } = await apiClient.put(`/reposts/${repostId}`, payload);
  return data;
};

/**
 * Delete a repost.
 * @param repostId The ID of the repost to delete.
 * @returns The response data from the API.
 */
export const deleteRepost = async (repostId: string) => {
  const { data } = await apiClient.delete(`/reposts/${repostId}`);
  return data;
};



export interface AddCommentToRepostPayload {
  content: string;
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
  reposts: MyRepost[];
}

// Interfaces for Reactions APIs
export type ReactionType = "like" | "dislike" | "love" | "clap" | "insightful";
export type TargetType = "Article" | "Comment" | "Repost";

export interface CreateUpdateReactionPayload {
  target_id: string;
  target_type: TargetType;
  type: ReactionType;
}

export interface ReactionResponseData {
  _id: string;
  type: ReactionType;
  user_id: string;
  target_id: string;
  target_type: TargetType;
  createdAt: string;
  updatedAt: string;
  v: number;
}

export interface UpdateReactionPayload {
  type: ReactionType;
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
 * Returns all articles reposted by the authenticated user.
 * @returns An array of the user's reposts.
 */
export const getMyReposts = async (): Promise<MyRepost[]> => {
  const { data } = await apiClient.get("/reposts/my");
  return data.reposts;
};



/**
 * Creates a new reaction or updates an existing one.
 * @param payload An object containing target_id, target_type, and type of reaction.
 * @returns The newly created or updated reaction data.
 */
export const createUpdateReaction = async (
  payload: CreateUpdateReactionPayload
): Promise<ReactionResponseData> => {
  const { data } = await apiClient.post("/reactions", payload);
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
): Promise<GetAllReactionsForTargetResponse> => {
  const { data } = await apiClient.get(
    `/reactions/${target_type}/${id}/reactions?page=${page}&limit=${limit}`
  );
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
): Promise<GetReactionsGroupedByTypeResponse> => {
  const { data } = await apiClient.get(
    `/reactions/${target_type}/${id}/reactions/per-type?page=${page}&limit=${limit}`
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