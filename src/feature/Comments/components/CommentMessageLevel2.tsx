import React, { useState, useEffect } from "react";
import { ThumbsUp, Edit, Trash2, EllipsisVertical, Send } from "lucide-react"; // Added Send
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import { User } from "../../../models/datamodels";
import { useCreateReactionRepost, useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";
import { useUser } from "../../../hooks/useUser";
import { useDeleteComment, useUpdateComment } from "../hooks"; // Added useUpdateComment
import { toast } from "react-toastify";
import { useRoute } from "../../../hooks/useRoute";

interface MessageComponentProps {
  content: string;
  createdAt: Date | string;
  author_id: string;
  isSameAuthorAsPrevious?: boolean;
  author: User;
  author_of_post: User;
  comment_id: string;
}

const CommentMessageLevel2: React.FC<MessageComponentProps> = ({
  content,
  createdAt,
  isSameAuthorAsPrevious,
  author,
  author_of_post,
  comment_id,
}) => {
  const [reactedid, setReactedids] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editedContent, setEditedContent] = useState(content); // State for input value
  // Align with CommentMessage: use target-based reaction hooks
  const target_type = "Comment" as const;
  const target_id = comment_id;
  const { mutate: createReactionRepost, isPending } = useCreateReactionRepost();
  const { data: reactionsData } = useGetAllReactionsForTarget(target_type, target_id);
  const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatePending } = useUpdateComment(); // Added update hook
  const { authUser } = useUser();
  const {goToProfile} = useRoute()
  // Track pending state for animation
  const [pendingUserAction, setPendingUserAction] = useState<null | 'like'>(null);

  useEffect(() => {
    const list = reactionsData?.data?.reactions;
    if (Array.isArray(list)) {
      const userIds = list
        .map((reaction: { user_id: string }) => reaction.user_id?.trim?.() || reaction.user_id)
        .filter(Boolean);
      setReactedids(userIds as string[]);
    }
  }, [reactionsData]);

  // Check if the current user has reacted
  const hasUserReacted = authUser?.id ? reactedid.includes(authUser.id) : false;
  const reactionCount = reactionsData?.data?.totalReactions || 0;
  // Only animate while loading; do not update visuals until settled.

  const formatDate = () => {
    try {
      if (typeof createdAt === "string") {
        return timeAgo(createdAt);
      }
      return timeAgo(createdAt.toISOString());
    } catch (error) {
      void error;
    }
  };

  const isAuthor = author?._id === author_of_post?._id;
  const isAuthAuthor = author?._id === authUser?.id;

  const handleReact = () => {
    if (!authUser?.id) return;
    setPendingUserAction('like');
    createReactionRepost({
      target_id: comment_id,
      target_type: "Comment",
      type: "like",
    },{
      onSettled: () => {
        setPendingUserAction(null);
      },
    });
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
          toast.success("Comment updated successfully");
          setIsEditing(false);
        },
        onError: () => {
          toast.error("Failed to update comment");
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

  return (
    <div
      className={`min-w-[88%] max-w-[90%] p-2 relative self-end overflow-visible ${
        isSameAuthorAsPrevious ? "self-end" : ""
      }`}
    >
      <div className="bg-neutral-700 p-3 relative rounded-xl shadow-sm inline-block w-full">
        <div className="flex items-start gap-2">
          {/* Avatar */}
          {author?.profile_picture ? (
            <img
              src={author.profile_picture}
              alt={author.username}
              className="size-6 rounded-full object-cover flex-shrink-0 cursor-pointer"
              onClick={handleProfileClick}
            />
          ) : (
            <div 
              onClick={handleProfileClick} 
              className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 cursor-pointer"
            >
              {author?.username?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* User Details - Properly separated */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="font-semibold text-neutral-50 text-[13px] truncate cursor-pointer hover:underline" 
                onClick={handleProfileClick}
              >
                {author?.username}
              </span>
              {author?.is_verified_writer && (
                <LuBadgeCheck className="text-primary-500 size-3.5 flex-shrink-0" strokeWidth={2.5} />
              )}
              {isAuthor && (
                <span className="px-1.5 py-0.5 bg-secondary-400 text-[11px] text-plain-b rounded flex-shrink-0">
                  Author
                </span>
              )}
              <span className="text-[11px] text-neutral-400 font-light whitespace-nowrap">
                {formatDate()}
              </span>
            </div>
            {author?.title && (
              <p className="text-[11px] text-neutral-500 truncate">{author?.title}</p>
            )}
          </div>

          {/* Menu Button */}
          {isAuthAuthor && (
            <button
              className="ml-2 p-1 rounded-full hover:bg-neutral-600 transition-colors flex-shrink-0"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Comment options"
            >
              <EllipsisVertical className="size-4 rotate-90 cursor-pointer text-neutral-50 hover:text-primary-400" />
            </button>
          )}
        </div>

        {/* Message Content */}
        {isEditing ? (
          <div className="mt-2 mb-1 flex items-center gap-2">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-transparent text-neutral-50 text-[13px] outline-none caret-white px-2"
              autoFocus
            />
            <button onClick={handleUpdateClick} disabled={isUpdatePending} className="p-1 hover:bg-neutral-600 rounded transition-colors">
              {isUpdatePending ? (
                <LuLoader className="animate-spin text-foreground inline-block size-4" />
              ) : (
                <Send size={16} className="text-neutral-50 hover:text-primary-400" />
              )}
            </button>
          </div>
        ) : (
          <p className="mt-2 mb-1 text-neutral-50 text-[13px] leading-relaxed">{content}</p>
        )}

        {/* Popup Menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-2 top-12 bg-neutral-800/95 backdrop-blur-md shadow-2xl rounded-lg p-2 w-40 text-neutral-50 z-50 border border-neutral-600/50">
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-700/50 cursor-pointer rounded transition-colors"
                onClick={handleEditClick}
              >
                <Edit size={16} className="text-neutral-100" />
                <span className="text-sm">Edit</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 cursor-pointer rounded transition-colors"
                onClick={handleDeleteClick}
              >
                {isDeletePending ? (
                  <LuLoader className="animate-spin inline-block size-4" />
                ) : (
                  <Trash2 size={16} className="text-red-400" />
                )}
                <span className="text-sm">{isDeletePending ? "Deleting..." : "Delete"}</span>
              </div>
            </div>
          </>
        )}

        {/* Actions (React) */}
        <div className="flex gap-4 mt-3 text-neutral-400 text-[11px]">
          <button
            className={`flex items-center gap-1 hover:text-primary-400 transition-colors ${
              hasUserReacted ? "text-primary-400" : ""
            }`}
            onClick={handleReact}
            disabled={isPending}
          >
            <span className={
              pendingUserAction && isPending
                ? "animate-bounce"
                : ""
            }>
              <ThumbsUp className="size-4" />
            </span>
            {isPending ? (
              <LuLoader className="animate-spin inline-block size-3" />
            ) : (
              <span>React</span>
            )}
            {/* Show updated count from cache only after mutation settles */}
            {reactionCount > 0 && !isPending && (
              <span className="ml-1">• {reactionCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentMessageLevel2;