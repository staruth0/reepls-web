import React from "react";
import { ThumbsUp } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import { User } from "../../../models/datamodels";

interface MessageComponentProps {
  content: string;
  createdAt: Date | string;
  author_id: string;
  isSameAuthorAsPrevious?: boolean;
  author: User;
  author_of_post:User;
}

const CommentMessageLevel2: React.FC<MessageComponentProps> = ({ content, createdAt, isSameAuthorAsPrevious, author, author_of_post }) => {
 
  const formatDate = () => {
    try {
      if (typeof createdAt === "string") {
        return timeAgo(createdAt);
      }
      return timeAgo(createdAt.toISOString());
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  };
  const isAuthor = author?._id === author_of_post?.id;

  return (
    <div
      className={`min-w-[90%] p-2 relative self-start ${
        isSameAuthorAsPrevious ? "self-end" : ""
      }`}
    >
      <div className="bg-neutral-700 p-3 relative rounded-xl shadow-sm inline-block w-full">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
            {author?.username?.charAt(0)}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="font-semibold flex items-center justify-between text-neutral-50 text-[14px]">
              <div className="flex items-center gap-2">
                {author?.username}
                {author?.is_verified_writer && (
                    <LuBadgeCheck
                         className="text-primary-500 size-4"
                         strokeWidth={2.5}
                                 />
                         )}
                {isAuthor && (
                   <div className="px-2 bg-secondary-400 text-[12px] text-plain-b rounded">
                       Author
                   </div>
                               )}
              </div>
              <div className="absolute right-2 text-[12px] font-light">
                {formatDate()}
              </div>
            </div>
            <p className="text-[12px] text-gray-500">{author?.title}</p>
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
      </div>
    </div>
  );
};

export default CommentMessageLevel2;
