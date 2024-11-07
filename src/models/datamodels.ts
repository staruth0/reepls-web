export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Reader" | "Writer";
  profile_picture?: string;
  bio?: string;
  address?: string;
  interests?: string[];
  is_verified_writer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  article_id: string;
  title: string;
  content: string;
  category: string;
  keywords?: string[];
  media: string[];
  text_to_speech?: string;
  author_id: string;
  status: "Draft" | "Published" | "Archived";
  created_at: string;
  updated_at: string;
  views_count: number;
  reports_count: number;
}

export interface Comment {
  comment_id: string;
  content: string;
  author_id: string;
  article_id: string;
  parent_comment_id?: string;
  created_at: string;
}

export interface Follow {
  follow_id: string;
  follower_id: string;
  followed_id: string;
  created_at: string;
}

export interface Reaction {
  reaction_id: string;
  type: "Like" | "Insightful" | "Love";
  user_id: string;
  article_id: string;
  created_at: string;
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
