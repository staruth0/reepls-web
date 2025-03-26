import { apiClient } from "../../../services/apiClient";

// Send a reaction notification
export const sendReactionNotification = async (payload: {
  article_id: string;
  type: string;
}) => {
  const { data } = await apiClient.post("/notification/reaction", payload);
  return data;
};

// Send a comment notification
export const sendCommentNotification = async (payload: {
  parent_comment_id?: string;
  content: string;
  article_id: string;
}) => {
  const { data } = await apiClient.post("/notification/comment", payload);
  return data;
};

// Send a follow notification
export const sendFollowNotification = async (payload: { receiver_id: string }) => {
  const { data } = await apiClient.post("/notification/follow", payload);
  return data;
};

// Send a new article notification
export const sendNewArticleNotification = async (payload: {
  title: string;
  subtitle: string;
  content: string;
  htmlContent: string;
  isArticle: boolean;
  media: { url: string; type: string }[];
}) => {
  const { data } = await apiClient.post("/notification/new-article", payload);
  return data;
};

// Fetch all notifications for the current user
export const fetchUserNotifications = async () => {
  const { data } = await apiClient.get("/notification/user-notifications");
  return data;
};

// Update the read status of a notification
export const updateNotificationReadStatus = async (
  notificationId: string,
  isRead: boolean
) => {
  const { data } = await apiClient.patch(
    `/notification/${notificationId}/read-status?isRead=${isRead}`
  );
  return data;
};