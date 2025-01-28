// components/MessageComponent.tsx
import React from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";

interface MessageComponentProps {
  username: string;
  role: string;
  timeAgo: string;
  message: string;
  reactions: number;
  replies: number;
}

const CommentMessage: React.FC<MessageComponentProps> = ({username,role,timeAgo,message,reactions,replies}) => {

    const handleRandomAlignSelf = () => { 
        const random = Math.floor(Math.random() * 2);
        return random === 0 ? "self-start" : "self-end";
    }

    return (
      <div className={`text-neutral-50 p-4 ${handleRandomAlignSelf()}`} >
        <div className="bg-neutral-700  p-3 relative rounded-xl shadow-sm inline-block">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {username.charAt(0)}
            </div>

            <div>
              <div className="font-semibold flex items-center justify-between text-neutral-50 text-[14px]">
                <div className="flex items-center gap-2">
                  {username}  <LuBadgeCheck className="text-primary-500 size-4" strokeWidth={2.5} />
                </div>
                <div className="absolute right-2 text-[12px] font-light">
                  {timeAgo}
                </div>
              </div>
              <p className="text-[12px] text-gray-500">{role}</p>
            </div>
          </div>
          <p className="mt-2 mb-1 text-neutral-50 text-[13px]">{message}</p>
        </div>
        <div className="flex gap-4 mt-2 text-gray-600 text-[11px] px-4">
          <button className="flex items-center gap-1 hover:text-primary-400">
            <ThumbsUp className="size-4" /> React • {reactions}
          </button>
          <button className="flex items-center gap-1 hover:text-primary-400">
            <MessageCircle className="size-4" />
            Reply • {replies} replies
          </button>
        </div>
      </div>
    );
};

export default CommentMessage;
