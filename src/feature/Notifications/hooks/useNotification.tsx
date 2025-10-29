import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendReactionNotification,
  sendCommentNotification,
  sendFollowNotification,
  sendNewArticleNotification,
  fetchUserNotifications,
  updateNotificationReadStatus,
  fetchVapidPublicKey,
} from "../api";

// Hook to fetch user notifications
export const useFetchUserNotifications = () => {
  return useQuery({
    queryKey: ["userNotifications"],
    queryFn: fetchUserNotifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Hook to send a reaction notification
export const useSendReactionNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendReactionNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["reaction"],
      });
      queryClient.invalidateQueries({
        queryKey: ["articleReactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactionsPerType"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reactedUsers"],
      });
    },
  });
};

// Hook to send a comment notification
export const useSendCommentNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendCommentNotification,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};

// Hook to send a follow notification
export const useSendFollowNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFollowNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({
        queryKey: ['following'],
      });
    },
  });
};

// Hook to send a new article notification
export const useSendNewArticleNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendNewArticleNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
       queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

// Hook to update the read status of a notification
export const useUpdateNotificationReadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notificationId, isRead }: { notificationId: string; isRead: boolean }) =>
      updateNotificationReadStatus(notificationId, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });
};


// React Query hook to manage fetching the VAPID public key
export const useFetchVapidPublicKey = () => {
  return useQuery({
    queryKey: ['vapidPublicKey'],
    queryFn: fetchVapidPublicKey,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - VAPID key rarely changes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};