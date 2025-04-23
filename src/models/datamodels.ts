export enum UserRole {
  Admin = 'Admin',
  Reader = 'Reader',
  Writer = 'Writer',
}

export enum MediaType {
  Video = 'video',
  Image = 'image',
}

export type MediaItem = {
  url: string;
  type: MediaType;
};

export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface User {
  id?: string;
  _id?: string;
  user_id?: string;
  googleId?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
  profile_picture?: string;
  saved_articles?: string[];
  banner_picture?: string;
  bio?: string;
  about?: string;
  address?: string;
  title?: string;
  interests?: string[];
  is_verified_writer?: boolean;
  canMakeCommunique?:boolean;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  following?: string[];
  interactionHistory?: {
    categories: string[];
    likedArticles: string[];
    viewedArticles: string[];
  };
  tokens?: AuthTokens;
}

export interface Article {
  article_id?: string;
  title?: string;
  type?: 'ShortForm' | 'LongForm';
  is_communiquer?: boolean;
  subtitle?: string;
  content?: string;
  htmlContent?: string;
  category?: string[];
  keywords?: string[];
  media?: MediaItem[];
  text_to_speech?: string;
  flagged?: boolean;
  author_id?: User;
  status?: 'Draft' | 'Published' | 'Archived';
  createdAt?: string;
  updatedAt?: string;
  views_count?: number;
  reports_count?: number;
  slug?: string;
  _id?: string;
  isArticle?: boolean;
  shares_count?: number,
  reaction_count?: number,
  comment_count?: number,
  impression_count?: number,
  engagement_ount?: number,
  author_follower_count?: number,
  author_profile_views_count?: number,
  
}

export interface Comment {
  content?: string;
  author_id?: string;
  article_id?: string;
  parent_comment_id?: string;
  is_audio_comment?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  replies?: Comment[];
  _id?: string;
  author?: User;
  comment_id?:string;
}

export interface Follow {
  follower_id: User;
  followed_id: User;
}

export interface Reaction {
  reaction_id?: string;
  type: string;
  user_id: string;
  article_id: string;
  createdAt?: string;
}
export interface ReactionReceived {
  reaction_id?: string;
  type: string;
  user_id: User;
  article_id: string;
  createdAt?: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: 'New Comment' | 'Reaction' | 'New Follower';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  report_id: string;
  article_id: string;
  reporter_id: string;
  reason: string;
  status: 'Pending' | 'Resolved';
  created_at: string;
}

export interface EmailCode {
  email: string;
}

export interface CodeVerify {
  code: string;
  email: string;
}

export interface PhoneCode {
  phone: string;
}

export interface PhoneVerify {
  code: string;
  phone: string;
}

export interface Token {
  token: string;
  expires: string;
}

export interface Tokens {
  access: Token;
  refresh: Token;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

// src/feature/Profile/types.ts
export interface MediaItemType {
  url: string;
  type: 'image' | 'video';
}

export interface PostMedia {
  media: MediaItemType[];
  postId: string;
  title: string;
}

export interface MediaResponse {
  mediaData: PostMedia[];
  totalMedia: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}