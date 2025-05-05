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
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t(`Notifications`)}</p>
        </Topbar>

        {/* Notification content */}
        <div className="notification__content mt-8 mb-10 md:px-10 lg:px-20 px-5">
          <div className="mt-6 flex flex-col gap-5">
            {notifications.map((notification, index) => {
              const { type, sender_id, content, created_at,is_read,_id ,slug,article_id} = notification;

            
              switch (type) {
                case 'follow':
                  return (
                    <FollowNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)}
                      is_read={is_read}
                      id={_id}
                    />
                  );
                case 'comment':
                  return (
                    <CommentNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)} 
                      comment={content}
                      is_read={is_read}
                      id={_id}
                      slug={slug}
                      article_id={article_id!}
                    />
                  );
                case 'reaction':
                  return (
                    <ReactionNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)} 
                      postSnippet={content}
                      is_read={is_read}
                      id={_id}
                      slug={slug}
                      article_id={article_id!}
                    />
                  );
                case 'post':
                  return (
                    <PostNotificationContainer
                      key={index}
                      username={sender_id}
                      timestamp={formatTimestamp(created_at)}
                      communique={content}
                      is_read={is_read}
                      id={_id}
                      slug={slug}
                      article_id={article_id!}
                      type={type}
                    />
                  );
                default:
                  return null; 
              }
            })}
          </div>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="profile__configurationz bg-background hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default Notifications;