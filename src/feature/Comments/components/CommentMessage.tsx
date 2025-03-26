import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import CommentSectionLevel2 from "./CommentSectionLevel2";
import { Comment,  ReactionReceived,  User } from "../../../models/datamodels";
import { useCreateCommentReaction, useGetCommentReactions } from "../../Interactions/hooks";
import { useUser } from "../../../hooks/useUser";

interface MessageComponentProps {
  content: string;
  createdAt: Date | string;
  author_id: string;
  isSameAuthorAsPrevious: boolean;
  article_id: string;
  comment_id: string;
  author: User;
  replies: Comment[];
  author_of_post: User;
  isLevelTwoCommentOpen:boolean;
  setIsLevelTwoCommentOpen:(isLevelTwoCommentOpen:boolean)=>void
}

const CommentMessage: React.FC<MessageComponentProps> = ({
  content,
  createdAt,
  isSameAuthorAsPrevious,
  article_id,
  comment_id,
  replies,
  author,
  author_of_post,
  isLevelTwoCommentOpen,
  setIsLevelTwoCommentOpen
}) => {

  const [reactedid, setReactedids] = useState<string[]>([]); 
  const { mutate: createReaction, isPending, isSuccess } = useCreateCommentReaction();
  const { data: reactions } = useGetCommentReactions(comment_id);
  const { authUser } = useUser();


  useEffect(() => {
    if (reactions?.reactions && Array.isArray(reactions.reactions)) {
      const userIds = reactions.reactions.map((reaction:ReactionReceived ) => reaction.user_id.id?.trim());
      setReactedids(userIds);
    }
  }, [reactions]);

  
  const hasUserReacted = authUser?.id ? reactedid.includes(authUser.id) : false;

  console.log("Comment reactions:", reactions);

  const reactionCount = reactions?.reactions?.length || 0;

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

  const isAuthor = author?._id === author_of_post?._id;

  const handleReact = () => {
    if (!authUser?.id) return; 
    createReaction({
      type: "like",
      user_id: authUser.id, 
      comment_id: comment_id,
    });
  };
  useEffect(()=>{
    console.log('author comment',author?._id)
    console.log('author post',author_of_post?._id)
    console.log('isAtuhor',isAuthor)
  },[isAuthor,author,author_of_post])

  return (
    <div
      className={`lg:min-w-[70%] w-full p-2 relative self-start ${
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
        <div className="flex items-center gap-1">
          <ThumbsUp
            onClick={handleReact}
            className={`size-4 hover:text-primary-400 hover:cursor-pointer ${
              hasUserReacted || isSuccess
                ? "fill-primary-400 text-primary-400"
                : ""
            }`}
          />
          {isPending ? (
            <LuLoader className="animate-spin text-primary-400 inline-block mx-1" />
          ) : (
            "React"
          )}{" "}
          <span>• {reactionCount}</span>
        </div>
        <button
          className="flex items-center gap-1 hover:text-primary-400"
          onClick={() => setIsLevelTwoCommentOpen(!isLevelTwoCommentOpen)}
        >
          <MessageCircle className="size-4" />
          Reply • {replies?.length} replies
        </button>
      </div>

      {isLevelTwoCommentOpen && (
        <CommentSectionLevel2
          article_id={article_id}
          comment_id={comment_id!}
          comments={replies}
          author_of_post={author_of_post}
        />
      )}
    </div>
  );
};

export default CommentMessage;