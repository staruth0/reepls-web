export enum UserRole {
  Admin = "Admin",
  Reader = "Reader",
  Writer = "Writer",
}

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
  user_id?: string;
  googleId?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole; 
  profile_picture?: string;
  saved_articles?: string[];
  banner_image?: string;
  bio?: string;
  address?: string;
  title?: string; // Formerly 'job'
  interests?: string[];
  is_verified_writer?: boolean;
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
  type?: "ShortForm" | "LongForm";
  is_communiquer?: boolean;
  subTitle?: string;
  content?: string;
  category?: string[];
  keywords?: string[];
  media?: string[];
  text_to_speech?: string;
  flagged?: boolean;
  author_id?: string;
  status?: "Draft" | "Published" | "Archived";
  createdAt?: string;
  updatedAt?: string;
  views_count?: number;
  reports_count?: number;
}

export interface Comment {
  content?: string;
  author_id?: string;
  article_id?: string;
  parent_comment_id?: string;
  is_audio_comment?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export interface Follow {
  follower_id: string;
  followed_id: string;
}

export interface Reaction {
  reaction_id?: string;
  type: string;
  user_id: string;
  article_id: string;
  createdAt?: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: "New Comment" | "Reaction" | "New Follower";
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  report_id: string;
  article_id: string;
  reporter_id: string;
  reason: string;
  status: "Pending" | "Resolved";
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
