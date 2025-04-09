import React, { useState, useEffect } from "react";
import { ThumbsUp, Edit, Trash2, EllipsisVertical, Send } from "lucide-react"; // Added Send
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import { User, ReactionReceived } from "../../../models/datamodels";
import { useCreateCommentReaction, useGetCommentReactions } from "../../Interactions/hooks";
import { useUser } from "../../../hooks/useUser";
import { useDeleteComment, useUpdateComment } from "../hooks"; // Added useUpdateComment
import { toast } from "react-toastify";

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
  const { mutate: createReaction, isPending, isSuccess } = useCreateCommentReaction();
  const { data: reactions } = useGetCommentReactions(comment_id);
  const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatePending } = useUpdateComment(); // Added update hook
  const { authUser } = useUser();

  useEffect(() => {
    if (reactions?.reactions && Array.isArray(reactions.reactions)) {
      const userIds = reactions.reactions.map((reaction: ReactionReceived) =>
        reaction.user_id.id?.trim()
      );
      setReactedids(userIds);
    }
  }, [reactions]);

  // Check if the current user has reacted
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

  return (
    <div
      className={`min-w-[90%] p-2 relative self-end ${
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
              <div className="absolute right-2 text-[12px] font-light flex items-center gap-2">
                {formatDate()}
                {isAuthAuthor && (
                  <EllipsisVertical
                    className="size-4 rotate-90 cursor-pointer text-neutral-50 hover:text-primary-400"
                    onClick={() => setShowMenu(!showMenu)}
                  />
                )}
              </div>
            </div>
            <p className="text-[12px] text-gray-500">{author?.title}</p>
          </div>
        </div>

        {/* Message Content */}
        {isEditing ? (
          <div className="mt-2 mb-1 flex items-center gap-2">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-transparent text-neutral-50 text-[13px] outline-none caret-white"
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

      {/* Actions (React) */}
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
      </div>
    </div>
  );
};

export default CommentMessageLevel2;