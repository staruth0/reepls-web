import React, { ReactNode, useState, useEffect } from "react";
import { NotificationContext, Notification } from "./NotificationContext";
// import { io } from "socket.io-client";
// import { useUser } from "../../hooks/useUser";
import { useFetchUserNotifications } from "../../feature/Notifications/hooks/useNotification";

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const { authUser } = useUser();

  // Fetch notifications on mount
  const { data } = useFetchUserNotifications();

  useEffect(() => {
    // Ensure notifications is always an array before sorting
    const notificationArray = Array.isArray(data?.notifications) ? data.notifications : [];
    if (notificationArray.length > 0) {
      // Sort notifications by created_at date with newest first
      const sortedNotifications = notificationArray.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Newest first (descending order)
      });
      setNotifications(sortedNotifications);
    } else {
      setNotifications([]);
    }
  }, [data]);

  // Add a new notification (if needed for other purposes)
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      // Sort to maintain newest first order
      return updated.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Newest first (descending order)
      });
    });
  };

  // // Socket.IO for real-time notifications
  // useEffect(() => {
  //   if (!authUser) return; 

  //   const socket = io("https://reepls-api.onrender.com");

  //   socket.on("connect", () => {
  //     socket.emit("join", authUser.id);
  //   });

  //   // Listen for new notifications
  //   socket.on("notification", (notification: Notification) => {
  //     addNotification(notification);
  //   });

  //   // Listen for reaction updates
  //   socket.on("reactionUpdate", (data) => {
  //     addNotification(data);
  //   });

  //   // Listen for comment updates
  //   socket.on("commentUpdate", (data) => {
  //     addNotification(data);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [authUser]); // Reconnect if the user changes

  const value = {
    notifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;