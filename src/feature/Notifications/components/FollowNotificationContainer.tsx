import React from "react";
// import { thumb } from "../../../assets/icons";
import { useGetUserById } from "../../Profile/hooks";
import { useUpdateNotificationReadStatus } from "../hooks/useNotification";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LucideUser } from "lucide-react";

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
        onSuccess: () => {
        },
      }
    );
  };

  return (
    <div
      onClick={updateStatus}
      className={`
        flex p-4 gap-3 w-full
        transition-all duration-200
        border-b border-gray-200 dark:border-gray-700
     
        cursor-pointer
        ${!is_read ? "bg-gray-800/5" : ""}
      `}
    >
      <div className="flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-primary-300 flex items-center justify-center p-1">
          <LucideUser className=" text-white" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-100  truncate">
            {user?.username}
          </span>
          <span className="text-sm text-neutral-100 truncate">
            {t("notification.followedYou")}
          </span>
        </div>

        <span className="text-xs text-neutral-200 whitespace-nowrap">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default FollowNotificationContainer;
