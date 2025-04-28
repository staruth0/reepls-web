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

  // Fetch notifications on mount and every 2 minutes
  const { data, refetch } = useFetchUserNotifications();

  useEffect(() => {
    console.log('fetched notification', data)
    if (data) {  
      setNotifications(data.notifications);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); 
    }, 2 * 60 * 1000); 

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refetch]);

  // Add a new notification (if needed for other purposes)
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // // Socket.IO for real-time notifications
  // useEffect(() => {
  //   if (!authUser) return; 

  //   const socket = io("https://reepls-api.onrender.com");

  //   socket.on("connect", () => {
  //     console.log("Connected with socket ID:", socket.id);
  //     socket.emit("join", authUser.id);
  //   });

  //   // Listen for new notifications
  //   socket.on("notification", (notification: Notification) => {
  //     console.log('received notification', notification);
  //     addNotification(notification);
  //   });

  //   // Listen for reaction updates
  //   socket.on("reactionUpdate", (data) => {
  //     console.log("Reaction update received:", data);
  //     addNotification(data);
  //   });

  //   // Listen for comment updates
  //   socket.on("commentUpdate", (data) => {
  //     console.log("Comment update received:", data);
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