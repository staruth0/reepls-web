import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import { useTranslation } from 'react-i18next';
import { useNotificationsValues } from '../hooks';
import PostNotificationContainer from '../components/NotificationContainer';
import FollowNotificationContainer from '../components/FollowNotificationContainer';
import CommentNotificationContainer from '../components/CommentNotificationContainer';
import ReactionNotificationContainer from '../components/ReactionNotificationContainer';
import PodcastNotificationContainer from '../components/PodcastNotificationContainer';
import PublicationNotificationContainer from '../components/PublicationNotificationContainer';
import { timeAgo } from '../../../utils/dateFormater';
import { FiBell } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import MainContent from '../../../components/molecules/MainContent';

const Notifications: React.FC = () => {
  const { notifications } = useNotificationsValues();
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.log("notifications", notifications);
  return (
    <MainContent> 
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <div className=" flex  items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 md:hidden block hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t(`Notifications`)}</p>
          </div>
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
            <div className="mt-6 flex max-w-2xl mx-auto flex-col gap-5">
              {notifications.map((notification, index) => {
                const { type, sender_id, content, created_at, is_read, _id, slug, article_id, isArticle, podcastId, podcast_id, publicationId, publication_id, url } = notification;
                // Prioritize podcast_id from backend, fallback to podcastId
                const podcastIdValue = podcast_id || podcastId;

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
                        podcastId={podcastIdValue}
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
                        podcastId={podcastIdValue}
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
                        podcastId={podcastIdValue}
                      />
                    );
                  case 'article':
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
                        podcastId={podcastIdValue}
                      />
                    );
                  case 'podcast':
                    return (
                      <PodcastNotificationContainer
                        key={index}
                        username={sender_id}
                        timestamp={timeAgo(created_at)}
                        communique={content}
                        is_read={is_read}
                        id={_id}
                        podcastId={podcastIdValue}
                      />
                    );
                  case 'publication':
                    return (
                      <PublicationNotificationContainer
                        key={index}
                        username={sender_id}
                        timestamp={timeAgo(created_at)}
                        communique={content}
                        is_read={is_read}
                        id={_id}
                        publicationId={publicationId}
                        publication_id={publication_id}
                        article_id={article_id}
                        url={url}
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
    </MainContent>
  );
};

export default Notifications;