import React, { useState, useMemo, useCallback, memo } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Edit,
  Trash2,
  EllipsisVertical,
  Send,

} from "lucide-react";
import { LuBadgeCheck, LuLoader, LuX } from "react-icons/lu";
import { timeAgo } from "../../../utils/dateFormater";
import CommentSectionLevel2 from "./CommentSectionLevel2";
import {
  Article,
  Comment,
  User,
} from "../../../models/datamodels";

import { useUser } from "../../../hooks/useUser";
import { useDeleteComment, useUpdateComment } from "../hooks";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useUpdateArticle } from "../../Blog/hooks/useArticleHook";
import { useRoute } from "../../../hooks/useRoute";
import { useCreateReactionRepost, useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils";

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
  article: Article;
}

interface Reaction {
  _id: string;
  type: "like" | "clap" | "love" | "smile" | "cry";
  user_id: string;
  target_id: string;
  target_type: "Article" | "Repost";
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  article,
}) => {
  const [isLevelTwoCommentOpen, setIsLevelTwoCommentOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  // Early return if author is not available
  if (!author) {
    return null;
  }

  // Define target type and ID for the new hook
  const target_type = "Comment";
  const target_id = comment_id;

  // Replaced useGetCommentReactions with useGetAllReactionsForTarget
  const { data: reactionsData } = useGetAllReactionsForTarget(target_type, target_id);
  
  const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatePending } = useUpdateComment();
  const { authUser } = useUser();
  const { mutate } = useUpdateArticle();
  const { goToProfile } = useRoute();
  const { mutate: createReactionRepost, isPending: isCreateReactionPending, isSuccess: isCreateReactionSuccess } = useCreateReactionRepost();

  // The new data structure has a `data.reactions` array
  // Use this array to check if the current user has reacted
  const hasUserReacted = reactionsData?.data?.reactions?.some(
    (reaction: Reaction) => reaction.user_id === authUser?.id
  );
  
  const reactionCount = reactionsData?.data?.totalReactions || 0;

  const formattedDate = useMemo(() => {
    try {
      if (typeof createdAt === "string") {
        return timeAgo(createdAt);
      }
      return timeAgo(createdAt.toISOString());
    } catch (error) {
      void error;
      return "";
    }
  }, [createdAt]);

  const isAuthor = useMemo(() => author?._id === author_of_post?._id, [author?._id, author_of_post?._id]);
  const isAuthAuthor = useMemo(() => author?._id === authUser?.id, [author?._id, authUser?.id]);

  const handleReact = useCallback(() => {
    if (!authUser?.id) return;
    createReactionRepost(
      {
        target_id: comment_id,
        target_type: "Comment",
        type: "like",
      },
      {
        onSuccess: () => {
          mutate({
            articleId: article._id || "",
            article: {
              engagement_count: article.engagement_count! + 1,
            },
          });
        },
      }
    );
  }, [authUser?.id, comment_id, article, mutate, createReactionRepost]);

  const handleToggleLevelTwo = useCallback(() => {
    onLevelTwoToggle?.(true);
    setIsLevelTwoCommentOpen(true);
  }, [onLevelTwoToggle]);

  // const handleCloseLevelTwo = () => {
  //   setIsLevelTwoCommentOpen(false);
  //   onLevelTwoToggle?.(false);
  // };

  // Handlers for popup actions
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setShowMenu(false);
  }, []);

  const handleUpdateClick = useCallback(() => {
    updateComment(
      { commentId: comment_id, content: editedContent },
      {
        onSuccess: () => {
          toast.success(t("Comment updated successfully"));
          setIsEditing(false);
        },
        onError: (error) => {
          toast.error(t("Failed to update comment"));
          setIsEditing(false);
          if (process.env.NODE_ENV === 'development') {
          console.error("Update comment error:", error.message);
        }
        },
      }
    );
  }, [comment_id, editedContent, updateComment, t]);

  const handleDeleteClick = useCallback(() => {
    deleteComment(comment_id, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        setShowMenu(false);
      },
      onError: (error) => {
        toast.error("Failed to delete comment");
        setShowMenu(false);
        if (process.env.NODE_ENV === 'development') {
          console.error("Delete comment error:", error.message);
        }
      },
    });
  }, [comment_id, deleteComment]);

  const handleProfileClick = useCallback(() => {
    if (author?.username) goToProfile(author.username);
  }, [author?.username, goToProfile]);

  // Remove empty useEffect

  return (
    <motion.div
      className={cn(
        "w-full p-2 sm:p-3 relative overflow-visible",
        isSameAuthorAsPrevious ? "self-end" : "self-start"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-neutral-700 p-2 sm:p-3 relative rounded-xl shadow-sm inline-block w-full transition-all duration-200"
        whileHover={{ scale: 1.01 }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer flex-shrink-0"
            onClick={handleProfileClick}
          >
            {author?.profile_picture ? (
              <img
                src={author.profile_picture}
                alt={author?.username || 'User'}
                className="size-7 sm:size-8 rounded-full object-cover"
              />
            ) : (
              <div className="size-7 sm:size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                {author?.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="font-semibold flex items-center justify-between text-neutral-50 text-xs sm:text-[14px]">
              <motion.div
                className="flex items-center gap-1 sm:gap-2 cursor-pointer group min-w-0"
                onClick={handleProfileClick}
                whileHover={{ x: 2 }}
              >
                <span className="font-semibold text-neutral-100 text-xs sm:text-sm group-hover:text-primary-400 transition-colors truncate">
                  {author?.username}
                </span>
                {author?.is_verified_writer && (
                  <LuBadgeCheck
                    className="text-primary-400 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    strokeWidth={2.5}
                  />
                )}
                {isAuthor && (
                  <motion.div 
                    className="px-1.5 sm:px-2 py-0.5 text-primary-400 text-[10px] sm:text-xs flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Author
                  </motion.div>
                )}
              </motion.div>
              
              <div className="absolute right-1 sm:right-2 text-[10px] sm:text-[12px] font-light flex items-center gap-1 sm:gap-2 text-neutral-100 flex-shrink-0">
                <span className="whitespace-nowrap">{formattedDate}</span>
                {isAuthAuthor && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-0.5 sm:p-1 rounded-full hover:bg-neutral-700/50 transition-colors"
                  >
                    <EllipsisVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-100 hover:text-neutral-200" />
                  </motion.button>
                )}
              </div>
            </div>
            
            {author?.title && (
              <p className="text-[10px] sm:text-[12px] text-neutral-100 truncate">{author.title}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="flex-1 bg-neutral-600/50 text-neutral-100 text-xs sm:text-sm outline-none rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-neutral-500/50 focus:border-primary-500/50"
                  autoFocus
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateClick} 
                  disabled={isUpdatePending}
                  className="p-1.5 sm:p-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 disabled:opacity-50 transition-colors"
                >
                  {isUpdatePending ? (
                    <LuLoader className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                  ) : (
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.p 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-100 text-xs sm:text-sm leading-relaxed break-words"
              >
                {content}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Popup Menu */}
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMenu(false)}
              />
              <motion.div 
                className="absolute right-4 top-12 bg-neutral-800/95 backdrop-blur-md shadow-2xl rounded-xl p-2 w-44 text-neutral-100 z-50 border border-neutral-600/50"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-3 py-2 w-full text-left hover:bg-neutral-700/50 rounded-lg transition-colors"
                  onClick={handleEditClick}
                >
                  <Edit size={16} className="text-neutral-100" />
                  <span className="text-sm text-neutral-100">Edit</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-3 py-2 w-full text-left hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  onClick={handleDeleteClick}
                >
                  {isDeletePending ? (
                    <LuLoader className="animate-spin size-4" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  <span className="text-sm text-neutral-100">{isDeletePending ? "Deleting..." : "Delete"}</span>
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Actions */}
      <motion.div 
        className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-3 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReact}
          aria-label={`React to ${author?.username || 'user'}'s comment`}
          aria-pressed={hasUserReacted || isCreateReactionSuccess}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-200",
            hasUserReacted || isCreateReactionSuccess
              ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
              : "text-neutral-400 hover:text-primary-400 hover:bg-primary-500/10"
          )}
        >
          {isCreateReactionPending ? (
            <LuLoader className="animate-spin w-3 h-3 sm:w-3 sm:h-3" />
          ) : (
            <ThumbsUp className="w-3 h-3 sm:w-3 sm:h-3" />
          )}
          <span className="text-neutral-100">React</span>
          {reactionCount > 0 && (
          <span className="bg-neutral-600/50 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs text-neutral-100">
            {reactionCount}
          </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleLevelTwo}
          aria-label={`Reply to ${author?.username || 'user'}'s comment`}
          aria-expanded={isLevelTwoCommentOpen}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-neutral-100 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
        >
          <MessageCircle className="w-3 h-3 sm:w-3 sm:h-3" />
          <span className="text-neutral-100">Reply</span>
          {replies?.length > 0 && (
            <span className="bg-neutral-600/50 px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs text-neutral-100">
              {replies.length}
            </span>
          )}
          {isLevelTwoCommentOpen && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <LuX className="w-3 h-3 sm:w-3 sm:h-3" />
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Level 2 Comments */}
      <AnimatePresence>
        {isLevelTwoCommentOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-visible"
          >
            <CommentSectionLevel2
              article_id={article_id}
              comment_id={comment_id}
              comments={replies}
              author_of_post={author_of_post}
              isTabActive={activeLevelTwoCommentId === comment_id}
              article={article}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(CommentMessage);