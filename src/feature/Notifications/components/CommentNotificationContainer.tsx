import React from "react";
// import { thumb } from "../../../assets/icons";
import { useGetUserById } from "../../Profile/hooks";
import { useUpdateNotificationReadStatus } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { LuMessageCircle } from "react-icons/lu";

interface CommentNotificationProps {
  username: string;
  timestamp: string;
  comment: string;
  is_read: boolean;
  id: string;
  slug: string;
  article_id: string;
isArticle:boolean
}

const CommentNotificationContainer: React.FC<CommentNotificationProps> = ({
  username,
  timestamp,
  isArticle,
  comment,
  is_read,
  id,
  slug,
  article_id,
}) => {
  const { user } = useGetUserById(username);
  const { mutate } = useUpdateNotificationReadStatus();
  const navigate = useNavigate();

  const updateStatus = () => {
    navigate(
      `${isArticle ? `/posts/article/slug/${slug}` : `/posts/post/${article_id}`}`
    );
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
        <div className="w-7 h-7 rounded-full bg-primary-300 flex  items-center justify-center">
          <LuMessageCircle className=" text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm font-bold text-neutral-100  truncate">
            {user?.name}
          </span>
          <span className="text-xs text-neutral-200  whitespace-nowrap">
            {timestamp}
          </span>
        </div>

        <p className="text-sm text-neutral-200">{comment}</p>
      </div>
    </div>
  );
};

export default CommentNotificationContainer;
