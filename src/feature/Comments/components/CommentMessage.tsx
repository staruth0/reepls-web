import React from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import { useGetUserById } from "../../Profile/hooks";

interface MessageComponentProps {
  content: string;
  createdAt: string;
  author_id: string;
  index: number;
}

const CommentMessage: React.FC<MessageComponentProps> = ({ content,createdAt,author_id,index,}) => {
  const { user } = useGetUserById(author_id);

  return (
    <div
      className={`min-w-[70%] p-4 relative  ${
        index % 2 === 0 ? "self-end" : "self-start"
      }`}
    >
      <div className="bg-neutral-700 p-3 relative rounded-xl shadow-sm inline-block w-full">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
            {user?.username?.charAt(0) }
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="font-semibold flex items-center justify-between text-neutral-50 text-[14px]">
              <div className="flex items-center gap-2">
                {user?.username }
              
                  <LuBadgeCheck
                    className="text-primary-500 size-4"
                    strokeWidth={2.5}
                  />
              
              </div>
              <div className="absolute right-2 text-[12px] font-light">
                {timeAgo(createdAt)}
              </div>
            </div>
            <p className="text-[12px] text-gray-500">{user?.title}</p>
          </div>
        </div>

        {/* Message Content */}
        <p className="mt-2 mb-1 text-neutral-50 text-[13px]">{content}</p>
      </div>

      {/* Actions (React & Reply) */}
      <div className="flex gap-4 mt-2 text-gray-600 text-[11px] px-4">
        <button className="flex items-center gap-1 hover:text-primary-400">
          <ThumbsUp className="size-4" /> React • 500
        </button>
        <button className="flex items-center gap-1 hover:text-primary-400">
          <MessageCircle className="size-4" />
          Reply • 1000 replies
        </button>
      </div>
    </div>
  );
};

export default CommentMessage;
