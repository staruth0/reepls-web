import { useContext } from 'react';
import { NotificationContext } from '../../../context/NotificationContext/NotificationContext';


export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('no notifications');
  }

  return context;
};