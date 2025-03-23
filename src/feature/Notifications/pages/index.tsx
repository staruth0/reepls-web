import React, { useEffect } from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import { useTranslation } from 'react-i18next';
import { useNotificationsValues } from '../hooks';
import PostNotificationContainer from '../components/NotificationContainer';
import FollowNotificationContainer from '../components/FollowNotificationContainer';
import CommentNotificationContainer from '../components/CommentNotificationContainer';
import ReactionNotificationContainer from '../components/ReactionNotificationContainer';

const Notifications: React.FC = () => {
  const { notifications } = useNotificationsValues();
  const { t } = useTranslation();

  useEffect(() => {
    console.log('notifications', notifications);
  }, [notifications]);

  // Helper function to format the timestamp
  const formatTimestamp = (createdAt: Date): string => {
    const date = new Date(createdAt);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`; // e.g., "13:50"
  };

  return (
    <div className={`grid grid-cols-[4fr_1.65fr]`}>
      <div className="profile border-r-[1px] border-neutral-500">
        <Topbar>
          <p>{t(`Notifications`)}</p>
        </Topbar>

        {/* Notification content */}
        <div className="notification__content px-20">
          <div className="mt-6 flex flex-col gap-5">
            {notifications.map((notification, index) => {
              const { type, sender_id, content, created_at } = notification;

              // Render the appropriate component based on the notification type
              switch (type) {
                case 'follow':
                  return (
                    <FollowNotificationContainer
                      key={index}
                      username={sender_id} // Pass sender_id as username
                      timestamp={formatTimestamp(created_at)} // Pass formatted timestamp
                    />
                  );
                case 'comment':
                  return (
                    <CommentNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)} // Pass formatted timestamp
                      comment={content}
                    />
                  );
                case 'reaction':
                  return (
                    <ReactionNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)} // Pass formatted timestamp
                      postSnippet={content}
                    />
                  );
                case 'post':
                  return (
                    <PostNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)} // Pass formatted timestamp
                      communique={content}
                    />
                  );
                default:
                  return null; // Skip unknown notification types
              }
            })}
          </div>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="profile__configurationz hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default Notifications;