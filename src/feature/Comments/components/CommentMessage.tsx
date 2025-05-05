import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Edit, Trash2, EllipsisVertical, Send } from "lucide-react"; // Added Send
import { LuBadgeCheck, LuLoader, LuX } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import CommentSectionLevel2 from "./CommentSectionLevel2";
import { Article, Comment, ReactionReceived, User } from "../../../models/datamodels";
import { useCreateCommentReaction, useGetCommentReactions } from "../../Interactions/hooks";
import { useUser } from "../../../hooks/useUser";
import { useDeleteComment, useUpdateComment } from "../hooks";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useUpdateArticle } from "../../Blog/hooks/useArticleHook";
import { useRoute } from "../../../hooks/useRoute";

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
  onLevelTwoToggle?: (isOpen: boolean) => void;
  activeLevelTwoCommentId?: string | null;
  article:Article
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
  onLevelTwoToggle,
  activeLevelTwoCommentId,
  article
}) => {
  const [reactedid, setReactedids] = useState<string[]>([]);
  const [isLevelTwoCommentOpen, setIsLevelTwoCommentOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editedContent, setEditedContent] = useState(content); // State for input value
  const { mutate: createReaction, isPending, isSuccess } = useCreateCommentReaction();
  const { data: reactions } = useGetCommentReactions(comment_id);
  const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatePending } = useUpdateComment();
  const { authUser } = useUser();
   const { mutate } = useUpdateArticle();
   const {goToProfile} = useRoute()

  useEffect(() => {
    if (reactions?.reactions && Array.isArray(reactions.reactions)) {
      const userIds = reactions.reactions.map((reaction: ReactionReceived) =>
        reaction.user_id.id?.trim()
      );
      setReactedids(userIds);
    }
  }, [reactions]);

  const hasUserReacted = authUser?.id ? reactedid.includes(authUser.id) : false;
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
  const isAuthAuthor = author?._id === authUser?.id;

  const handleReact = () => {
    if (!authUser?.id) return;
    createReaction({
      type: "like",
      user_id: authUser.id,
      comment_id: comment_id,
    },{
      onSuccess:()=>{
         mutate({
          articleId: article._id || '',
          article: {
            engagement_ount: article.engagement_ount! + 1, 
          },
        });
      }
    });
  };

  const handleToggleLevelTwo = () => {
    onLevelTwoToggle?.(true);
    setIsLevelTwoCommentOpen(true);
  };

  const handleCloseLevelTwo = () => {
    setIsLevelTwoCommentOpen(false);
    onLevelTwoToggle?.(false);
  };

  // Handlers for popup actions
  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleUpdateClick = () => {
    updateComment(
      { commentId: comment_id, content: editedContent },
      {
        onSuccess: () => {
          toast.success(t("Comment updated successfully"));
          setIsEditing(false);
        },
        onError: () => {
          toast.error(t("Failed to update comment"));
          setIsEditing(false);
        },
      }
    );
  };

  const handleDeleteClick = () => {
    deleteComment(comment_id, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        setShowMenu(false);
      },
      onError: () => {
        toast.error("Failed to delete comment");
        setShowMenu(false);
      },
    });
  };
  const handleProfileClick = () => {
    if(author.username) goToProfile(author?.username)
  };

  useEffect(() => {
    console.log("author comment", author?._id);
    console.log("author post", author_of_post?._id);
    console.log("isAuthor", isAuthor);
  }, [isAuthor, author, author_of_post]);

  return (
    <div
      className={`lg:min-w-[70%] w-full p-2 relative self-start ${
        isSameAuthorAsPrevious ? "self-end" : ""
      }`}
    >
     <div className="bg-neutral-700 p-3 relative rounded-xl shadow-sm inline-block w-full">
  <div className="flex items-center gap-2">
    {author?.profile_picture ? (
      <img 
        src={author.profile_picture} 
        alt={author.username}
        className="size-6 rounded-full object-cover"
        onClick={handleProfileClick}
      />
    ) : (
      <div 
        className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]" 
        onClick={handleProfileClick}
      >
        {author?.username?.charAt(0)}
      </div>
    )}
    <div className="flex-1">
      <div className="font-semibold flex items-center justify-between text-neutral-50 text-[14px]">
        <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={handleProfileClick}>
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
        <div className="absolute right-2 text-[12px] font-light flex items-center gap-2">
          {formatDate()}
          {isAuthAuthor && (
            <EllipsisVertical
              className="size-6 rotate-90 cursor-pointer text-neutral-50 hover:text-primary-400"
              onClick={() => setShowMenu(!showMenu)}
            />
          )}
        </div>
      </div>
      <p className="text-[12px] text-gray-500">{author?.title}</p>
    </div>
  </div>
  {isEditing ? (
    <div className="mt-2 mb-1 flex items-center gap-2">
      <input
        type="text"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full bg-transparent text-neutral-50 text-[13px] outline-none caret-neutral-50"
        autoFocus
      />
      <button onClick={handleUpdateClick} disabled={isUpdatePending}>
        {isUpdatePending ? (
          <LuLoader className="animate-spin text-foreground inline-block size-4" />
        ) : (
          <Send size={18} className="text-neutral-50 hover:text-primary-400" />
        )}
      </button>
    </div>
  ) : (
    <p className="mt-2 mb-1 text-neutral-50 text-[13px]">{content}</p>
  )}

  {/* Popup Menu */}
  {showMenu && (
    <>
      <div
        className="fixed inset-0 bg-black opacity-0 z-40"
        onClick={() => setShowMenu(false)}
      ></div>
      <div className="absolute right-2 top-8 bg-neutral-800 shadow-md rounded-md p-2 w-40 text-neutral-50 z-50">
        <div
          className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
          onClick={handleEditClick}
        >
          <Edit size={18} className="text-neutral-500" />
          <div>Edit</div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer text-red-500"
          onClick={handleDeleteClick}
        >
          {isDeletePending ? (
            <LuLoader className="animate-spin text-foreground inline-block size-4" />
          ) : (
            <Trash2 size={18} className="text-red-500" />
          )}
          <div>{isDeletePending ? "Deleting..." : "Delete"}</div>
        </div>
      </div>
    </>
  )}
</div>

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
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 hover:text-primary-400"
            onClick={handleToggleLevelTwo}
          >
            <MessageCircle className="size-4" />
            Reply • {replies?.length} replies
          </button>
          {isLevelTwoCommentOpen && (
            <LuX
              onClick={handleCloseLevelTwo}
              className="size-4 hover:text-primary-400"
            />
          )}
        </div>
      </div>

      {isLevelTwoCommentOpen && (
        <CommentSectionLevel2
          article_id={article_id}
          comment_id={comment_id}
          comments={replies}
          author_of_post={author_of_post}
          isTabActive={activeLevelTwoCommentId === comment_id}
        />
      )}
    </div>
  );
};

export default CommentMessage;