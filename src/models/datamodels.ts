export enum UserRole {
  Admin = 'admin',
  Reader = 'reader',
  Writer = 'writer'
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


interface RepostUser {
  _id: string;
  username: string;
  name: string;
  profile_picture: string | null;
  is_verified_writer: boolean;
}

// **UPDATE THIS INTERFACE**
interface Repost {
  repost_user: RepostUser;
  repost_comment: string;
  repost_date: string; 
  repost_id: string;   
}

interface RepostHistory {
  reposted_articles: string[];
  reposted_posts: string[];   
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
  CanMakecommuniquer?:boolean;
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
 repostHistory?:RepostHistory;
  hasAsPublication?: boolean;
  publication?: miniPublication[];
}

export interface Publication {
  id?: string;
  _id?: string;
  title: string;
  short_description: string;
  description?: string;
  cover_image: string;
  banner_image?: string;
  owner_id?: string;
  articles_count?: number;
  subscribers_count?: number;
  is_deleted?: boolean;
  is_public?: boolean;
  tags?: string[];
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  collaborators?: PublicationCollaborator[];
  
}

export interface Subscriber {
  _id: string;
  username: string;
  bio: string;
  is_owner: boolean;
  is_verified_writer: boolean;
  role: string;
  subscription_date: string;
  subscription_id: string;
  subscription_status: string;

}

export interface Subscription {
  _id?: string;
  user_id: string;
  publication_id?: string;
  status?: 'active' | 'inactive';
  subscribed_at?: Date;
  unsubscribed_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublicationCollaborator {
  _id?: string;
  collaborator: string; 
  publication?: string; 
  permission: "Full Access" | "Edit Access" | "View Access";
  addedBy?: string; 
  status?: "active" | "removed" | "pending";
  addedAt?: Date;
}
export interface miniPublication {
  id?: string; 
  name:string;
  cover_image?: string; 
  role?:PubRole;
  permission?:PubPermission;


}

export enum PubRole {
  Owner = 'Owner',
  Contributor = 'Contributor'
}

export enum PubPermission {
  Read = 'Read',
  Write = 'Write',
  Edit = 'Edit',
  Delete = 'Delete',
}


export interface Article {
  id?: string;
  article_id?: string;
  title?: string;
  type?: 'ShortForm' | 'LongForm' | 'Repost';
  is_communiquer?: boolean;
  hasPodcast?:boolean;
  subtitle?: string;
  content?: string;
  htmlContent?: string;
  category?: string[];
  keywords?: string[];
  tags?: string[];
  media?: MediaItem[];
  text_to_speech?: string;
  thumbnail?: string;
  flagged?: boolean;
  author_id?: User;
  author?: User;
  status?: 'Draft' | 'Published' | 'Archived';
   repost?:Repost
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
  engagement_count?: number,
  author_follower_count?: number,
  author_profile_views_count?: number,
  podcastId?:string,
  publication_id?:string,
  
}

export interface ArticleDuplicate {
  id?: string;
  article_id?: string;
  title?: string;
  type?: 'ShortForm' | 'LongForm' | 'Repost';
  is_communiquer?: boolean;
  subtitle?: string;
  content?: string;
  htmlContent?: string;
  hasPodcast?:boolean;
  category?: string[];
  keywords?: string[];
  media?: MediaItem[];
  text_to_speech?: string;
  flagged?: boolean;
  author_id?: User;
  author?: User;
  status?: 'Draft' | 'Published' | 'Archived';
   repost?:Repost
  createdAt?: string;
  updatedAt?: string;
  views_count?: number;
  reports_count?: number;
  slug?: string;
  _id?: string;
  isArticle?: boolean;
  article:ArticleDuplicate;
  shares_count?: number,
  reaction_count?: number,
  comment_count?: number,
  impression_count?: number,
  engagement_count?: number,
  author_follower_count?: number,
  author_profile_views_count?: number,
   podcastId?:string,
  
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
  repostId?: string; 
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
  report_id?: string;
  article_id: string;
  reporter_id: string;
  article_author_id:string
  reason: string;
  status?: 'Pending' | 'Resolved';
  created_at?: string;
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


export interface IPodcast {
  id: string;
  title: string;
  description?: string;
  postId?: string; // Optional - for podcasts attached to articles
  authorId?: User;
  author?: User;

  // Audio properties
  audio: {
    url: string;
    storageKey: string; // Cloudinary public_id for deletion
    duration?: number; // in seconds
    fileSize: number; // in bytes
    mimeType: string;
    fileHash?: string; // SHA-256 hash for duplicate detection
    bitrate?: number;
    sampleRate?: number;
    channels?: number;
    format?: string;
  };

  // Podcast metadata
  tags?: string[];
  category?: string;
  isPublic: boolean;

  // Engagement and analytics
  downloadCount: number;
  playCount: number;
  uniqueListeners: string[]; // Array of user IDs who played this podcast
  commentsCount: number; // Cache for performance
  savesCount: number; // Number of users who saved this podcast
  sharesCount: number; // Track sharing analytics
  averageRating: number; // Average user rating
  totalRatings: number; // Total number of ratings
  likesCount: number; // Total number of ratings
  isBookmarked: boolean; // Total number of ratings


  // Advanced metadata
  subtitle?: string; // Short subtitle/summary
  thumbnailUrl?: string; // Custom thumbnail if provided

  status: PodcastStatus;

  // Optional processing metadata
  originalFileName?: string;
  processingNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum PodcastStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
  ARCHIVED = 'archived'
}

