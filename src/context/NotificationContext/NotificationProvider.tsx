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
    if (data) {  
      setNotifications(data.notifications);
    }
  }, [data]);

  // Removed automatic refetching - notifications will be fetched when needed
  // and updated via real-time updates or manual refresh

  // Add a new notification (if needed for other purposes)
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
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