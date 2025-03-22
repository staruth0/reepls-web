import React, { ReactNode, useState, useEffect } from 'react';
import { NotificationContext, NotificationContextProps, Notification } from './NotificationContext';
import { io } from 'socket.io-client';

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]); 
  };


  useEffect(() => {
    const socket = io('https://saah-server.vercel.app'); 

    
    socket.on('new-notification', (notification: Notification) => {
      addNotification(notification);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const value: NotificationContextProps = {
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