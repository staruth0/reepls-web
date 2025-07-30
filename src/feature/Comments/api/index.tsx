import { apiClient } from "../../../services/apiClient";
import { Comment } from "../../../models/datamodels";

// Interfaces for the new comments tree API
export interface CommentAuthor {
  _id: string;
  username: string;
  name: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  role: string;
  profile_picture: string | null;
  banner_picture: string | null;
  interests: string[];
  searchHistory: string[];
  is_verified_writer: boolean;
  interactionHistory: {
    categories: string[];
    likedArticles: string[];
    viewedArticles: string[];
    readArticles: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  CanMakecommuniquer: boolean;
  repostHistory: {
    reposted_articles: string[];
    reposted_posts: string[];
  };
}

export interface CommentNode {
  _id: string;
  content: string;
  is_audio_comment: boolean;
  targetType: string;
  targetId: string;
  author_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  author: CommentAuthor;
  isMainComment: boolean;
  replies: CommentNode[];
}

export interface GetCommentsTreeResponse {
  message: string;
  data: {
    commentsTree: CommentNode[];
    totalPages: number;
    parentCommentsCount: number;
    totalComments: number;
  };
}

// Create a comment
const createComment = async (comment: Comment) => {
  const { data } = await apiClient.post("/comment", comment);
  return data;
};

// Get comments for an article
const getCommentsByArticleId = async (articleId: string, page: number, limit: number) => {
  const { data } = await apiClient.get(`/comment/article/${articleId}?page=${page}&limit=${limit}`);
  return data;
};

// Get comments tree for an article (new API)
const getCommentsTreeForArticle = async (articleId: string, page: number = 1, limit: number = 10) => {
  const { data } = await apiClient.get(`/comment/Article/${articleId}?page=${page}&limit=${limit}`);
  return data;
};

// Update a comment
const updateComment = async (commentId: string, content: string) => {
  const { data } = await apiClient.put(`/comment/${commentId}`, { content });
  return data;
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  const { data } = await apiClient.delete(`/comment/${commentId}`);
  return data;
};

// Get replies for a comment
const getRepliesForComment = async (commentId: string) => {
  const { data } = await apiClient.get(`/comment/replies/${commentId}`);
  return data;
};

export {
  createComment,
  getCommentsByArticleId,
  getCommentsTreeForArticle,
  updateComment,
  deleteComment,
  getRepliesForComment,
};