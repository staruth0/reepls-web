import React from 'react';
import { thumb } from '../../../assets/icons';
import { useGetUserById } from '../../Profile/hooks';
import { useUpdateNotificationReadStatus } from '../hooks/useNotification';
import { useTranslation } from 'react-i18next';

interface FollowNotificationProps {
  username: string;
  timestamp: string;
  is_read: boolean;
  id: string;
}

const FollowNotificationContainer: React.FC<FollowNotificationProps> = ({
  username,
  timestamp,
  is_read,
  id
}) => {
  const { user } = useGetUserById(username);
  const { mutate } = useUpdateNotificationReadStatus();
  const { t } = useTranslation();

  const updateStatus = () => {
    mutate({ notificationId: id, isRead: true }, {
      onSuccess: () => {
        console.log('success read');
      }
    });
  };

  return (
    <div
      onClick={updateStatus}
      className={`
        flex p-4 gap-3 w-full
        transition-all duration-200
        border-b border-gray-200 dark:border-gray-700
     
        cursor-pointer
        ${!is_read ? 'bg-gray-800/5' : ''}
      `}
    >
      <div className="flex-shrink-0">
        <img 
          src={thumb} 
          alt="follow" 
          className="w-6 h-6 text-blue-500" 
        />
      </div>
      
      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user?.username}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t("notification.followedYou")}
          </span>
        </div>
        
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default FollowNotificationContainer;