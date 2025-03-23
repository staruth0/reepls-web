import { useContext } from "react";
import { NotificationContext } from "../../../context/NotificationContext/NotificationContext";
import {
  useSendReactionNotification,
  useSendCommentNotification,
  useSendFollowNotification,
  useSendNewArticleNotification,
  useUpdateNotificationReadStatus,
} from "../hooks/useNotification";

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return {
    ...context,
    sendReactionNotification: useSendReactionNotification(),
    sendCommentNotification: useSendCommentNotification(),
    sendFollowNotification: useSendFollowNotification(),
    sendNewArticleNotification: useSendNewArticleNotification(),
    updateNotificationReadStatus: useUpdateNotificationReadStatus(),
  };
};