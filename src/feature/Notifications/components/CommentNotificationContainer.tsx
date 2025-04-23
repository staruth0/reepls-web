import React from 'react';
import { thumb } from '../../../assets/icons';
import { useGetUserById } from '../../Profile/hooks';
import { useUpdateNotificationReadStatus } from '../hooks/useNotification';

interface CommentNotificationProps {
  username: string;
  timestamp: string;
  comment: string;
  is_read: boolean;
  id: string;
}

const CommentNotificationContainer: React.FC<CommentNotificationProps> = ({ 
  username, 
  timestamp, 
  comment, 
  is_read, 
  id 
}) => {
  const { user } = useGetUserById(username);
  const { mutate } = useUpdateNotificationReadStatus();


  const updateStatus = () => {
    mutate({ notificationId: id, isRead: true }, {
      onSuccess: () => {
        console.log('success read');
      },
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
          alt="comment" 
          className="w-6 h-6 " 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user?.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-200">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default CommentNotificationContainer;