import React from 'react';
import { thumb } from '../../../assets/icons';
import { useUpdateNotificationReadStatus } from '../hooks/useNotification';
import { useGetUserById } from '../../Profile/hooks';
import { useTranslation } from 'react-i18next';

interface PostNotificationProps {
  username: string;
  timestamp: string;
  communique: string;
  is_read: boolean;
  id: string;
}

const PostNotificationContainer: React.FC<PostNotificationProps> = ({
  username,
  timestamp,
  communique,
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
          alt="post" 
          className="w-6 h-6 text-blue-500" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user?.username}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          {t("notification.communique")}
        </p>
        
        <div className="text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded px-3 py-2">
          {communique}
        </div>
      </div>
    </div>
  );
};

export default PostNotificationContainer;