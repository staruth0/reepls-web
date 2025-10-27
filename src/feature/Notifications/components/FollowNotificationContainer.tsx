import React from "react";
import { useGetUserById } from "../../Profile/hooks";
import { useUpdateNotificationReadStatus } from "../hooks/useNotification";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";

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
  id,
}) => {
  const { user } = useGetUserById(username);
  const { mutate } = useUpdateNotificationReadStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const updateStatus = () => {
    navigate(`/profile/${username}`);
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
          <div className="relative">
            <img
              src={user.profile_picture}
              alt={user.name || "User"}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary-400/20"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 border-2 border-background dark:border-gray-900 flex items-center justify-center">
              <LuUserPlus className="w-3 h-3 text-white" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-400 flex items-center justify-center border-2 border-primary-400/20">
              <span className="text-white text-sm sm:text-base font-semibold">
                {getAvatarInitials(user?.name)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 border-2 border-background dark:border-gray-900 flex items-center justify-center">
              <LuUserPlus className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-neutral-100 hover:text-primary-400 transition-colors truncate">
              {user?.name || user?.username || username}
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 truncate">
              {t("notification.followedYou")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 whitespace-nowrap">
            {timestamp}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowNotificationContainer;
