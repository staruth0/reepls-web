import { createContext } from 'react';

export interface Notification {
  _id: string;
  type: 'reaction' | 'comment' | 'follow' | 'post' | 'article' | 'podcast' | 'publication';
  category: 'comment_reaction' | 'connecting' | 'new_post'; 
  article_id?: string;
  sender_id: string; 
  receiver_id: string | string[]; 
  created_at:string;
  slug:string;
  is_read:boolean;
  content: string; 
  isArticle?:boolean;
  timestamp?: Date;
  podcastId?: string;
  podcast_id?: string;
  publicationId?: string;
  publication_id?: string;
  url?: string;
}

export interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

const initialState: NotificationContextProps = {
  notifications: [],
  addNotification: () => {},
};

export const NotificationContext = createContext<NotificationContextProps>(initialState);