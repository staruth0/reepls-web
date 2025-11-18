import React from "react";
import { useGetUserById } from "../../Profile/hooks";
import { useUpdateNotificationReadStatus } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { LuMic } from "react-icons/lu";

interface PodcastNotificationProps {
  username: string;
  timestamp: string;
  communique: string;
  is_read: boolean;
  id: string;
  podcastId?: string;
  podcast_id?: string;
}

const PodcastNotificationContainer: React.FC<PodcastNotificationProps> = ({
  username,
  timestamp,
  communique,
  is_read,
  id,
  podcastId,
  podcast_id,
}) => {
  const { user } = useGetUserById(username);
  const { mutate } = useUpdateNotificationReadStatus();
  const navigate = useNavigate();

  // Prioritize podcast_id from backend, fallback to podcastId
  const podcastIdValue = podcast_id || podcastId;

  const updateStatus = () => {
    if (podcastIdValue) {
      navigate(`/podcast/${podcastIdValue}`);
    } else {
      navigate('/notifications');
    }
    mutate(
      { notificationId: id, isRead: true },
      {
        onSuccess: () => {},
      }
    );
  };

  const getAvatarInitials = (name?: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      onClick={updateStatus}
      className={`
        group relative flex gap-3 sm:gap-4 p-3 sm:p-4 w-full
        transition-all duration-200 ease-out
        cursor-pointer
        ${!is_read ? "bg-primary-500/5 dark:bg-primary-500/10" : "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}
      `}
    >
      {/* Avatar/Icon */}
      <div className="flex-shrink-0 flex items-start pt-0.5">
        {user?.profile_picture ? (
          <img
            src={user.profile_picture}
            alt={user.name || "User"}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary-400/20"
          />
        ) : (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-400 flex items-center justify-center border-2 border-primary-400/20">
            <span className="text-white text-sm sm:text-base font-semibold">
              {getAvatarInitials(user?.name)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-neutral-100 hover:text-primary-400 transition-colors">
              {user?.name || username}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
              Podcast
            </span>
          </div>
          <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
            {timestamp}
          </span>
        </div>

        <div className="relative">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2">
            <LuMic className="w-4 h-4 text-purple-400/60" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-200 pl-5 line-clamp-2 leading-relaxed">
            {communique}
          </p>
        </div>
      </div>

      {/* Hover arrow indicator */}
      <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default PodcastNotificationContainer;

