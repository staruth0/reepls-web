import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import { useTranslation } from 'react-i18next';
import { useNotificationsValues } from '../hooks';
import PostNotificationContainer from '../components/NotificationContainer';
import FollowNotificationContainer from '../components/FollowNotificationContainer';
import CommentNotificationContainer from '../components/CommentNotificationContainer';
import ReactionNotificationContainer from '../components/ReactionNotificationContainer';
import { timeAgo } from '../../../utils/dateFormater';
import { FiBell } from 'react-icons/fi'; 

const Notifications: React.FC = () => {
  const { notifications } = useNotificationsValues();
  const { t } = useTranslation();

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t(`Notifications`)}</p>
        </Topbar>

        {/* Notification content */}
        <div className="notification__content mt-8 mb-10 md:px-10 lg:px-20 px-5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <FiBell className="text-4xl text-neutral-400 mb-4" />
              <h3 className="text-xl font-medium text-neutral-300 mb-2">
                {t('emptyTitle')}
              </h3>
              <p className="text-neutral-400 max-w-md">
                {t('emptyDescription')}
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-5">
              {notifications.map((notification, index) => {
                const { type, sender_id, content, created_at, is_read, _id, slug, article_id, isArticle } = notification;

                switch (type) {
                  case 'follow':
                    return (
                      <FollowNotificationContainer
                        key={index}
                        username={sender_id}
                        timestamp={timeAgo(created_at)}
                        is_read={is_read}
                        id={_id}
                      />
                    );
                  case 'comment':
                    return (
                      <CommentNotificationContainer
                        key={index}
                        username={sender_id}
                        timestamp={timeAgo(created_at)} 
                        comment={content}
                        is_read={is_read}
                        isArticle={isArticle!}
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
                        timestamp={timeAgo(created_at)} 
                        postSnippet={content}
                        is_read={is_read}
                        id={_id}
                        slug={slug}
                        article_id={article_id!}
                        isArticle={isArticle!}
                      />
                    );
                  case 'post':
                    return (
                      <PostNotificationContainer
                        key={index}
                        username={sender_id}
                        timestamp={timeAgo(created_at)}
                        communique={content}
                        is_read={is_read}
                        id={_id}
                        slug={slug}
                        article_id={article_id!}
                        type={type}
                        isArticle={isArticle!}
                      />
                    );
                  default:
                    return null; 
                }
              })}
            </div>
          )}
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