import { createContext } from 'react';

export interface Notification {
  _id: string;
  type: 'reaction' | 'comment' | 'follow' | 'post';
  category: 'comment_reaction' | 'connecting' | 'new_post'; 
  article_id?: string;
  sender_id: string; 
  receiver_id: string | string[]; 
  created_at:Date;
  is_read:boolean;
  content: string; 
  timestamp?: Date; 
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