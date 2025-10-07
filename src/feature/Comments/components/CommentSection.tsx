import React, { useEffect, useState } from "react";
import { LuX, LuLoader, LuCircleAlert, LuMessageCircle } from "react-icons/lu";
import { Article, Comment, User } from "../../../models/datamodels";
import { useGetCommentsByArticleId } from "../hooks";
import CommentMessage from "./CommentMessage";
import CommentTab from "./CommentTab";
import { useGetCommentsTreeForRepost } from "../../Repost/hooks/useRepost";
import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "../../../utils";

interface CommentSectionProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  author_of_post: User;
  article: Article;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  article,
}) => {
  const {
    data: articleComments,
    isLoading: isArticleCommentsLoading,
    isError: isArticleCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommentsByArticleId(article_id);

  const {
    data: repostComments,
    isLoading: isRepostCommentsLoading,
    isError: isRepostCommentsError,
  } = useGetCommentsTreeForRepost(article.repost?.repost_id || "");

  // Determine which loading and error states to use based on article type
  const isLoading =
    article.type === "Repost" ? isRepostCommentsLoading : isArticleCommentsLoading;
  const isError = article.type === "Repost" ? isRepostCommentsError : isArticleCommentsError;


    const commentsToRender =
    article.type === "Repost" && repostComments
      ? repostComments.commentsTree
      : articleComments?.pages
          ?.flatMap((page) => page.data.commentsTree) || [];

  const [hasOpenLevelTwo, setHasOpenLevelTwo] = useState(false);
  const [activeLevelTwoCommentId, setActiveLevelTwoCommentId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Repost comments:", repostComments);
  }, [article_id, articleComments, repostComments]);

    const handleLevelTwoToggle = (commentId: string, isOpen: boolean) => {
    setHasOpenLevelTwo(isOpen);
    if (isOpen) {
      setActiveLevelTwoCommentId(commentId);
    } else if (activeLevelTwoCommentId === commentId) {
      setActiveLevelTwoCommentId(null);
    }
  };

  




  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  if (isLoading)
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex flex-col items-center gap-3">
          <LuLoader className="animate-spin text-primary-400 text-2xl" />
          <p className="text-neutral-400 text-sm">Loading comments...</p>
        </div>
      </motion.div>
    );

  if (isError)
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex flex-col items-center gap-3 text-red-400">
          <LuCircleAlert className="text-2xl" />
          <p className="text-sm">Error loading comments</p>
        </div>
      </motion.div>
    );

  return (
    <motion.div 
      className="overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-end p-4"
        variants={headerVariants}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCommentSectionOpen(false)}
          className="p-2 rounded-full hover:bg-neutral-700/50 transition-colors group"
        >
          <LuX className="text-neutral-400 group-hover:text-neutral-100 transition-colors" />
        </motion.button>
      </motion.div>

      {/* Comment Input */}
      <AnimatePresence>
        {!hasOpenLevelTwo && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-4"
          >
            <CommentTab
              article_id={article_id}
              setIsCommentSectionOpen={setIsCommentSectionOpen}
              article={article}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {commentsToRender.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-12 text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LuMessageCircle className="text-4xl mb-3 opacity-50" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs opacity-75">Be the first to share your thoughts!</p>
            </motion.div>
          ) : (
            commentsToRender.map((comment: Comment, index: number) => {
              const isSameAuthorAsPrevious =
                index > 0 && comment.author_id === commentsToRender[index - 1].author_id;

              return (
                <motion.div
                  key={comment._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className=""
                >
                  <CommentMessage
                    content={comment.content!}
                    createdAt={comment.createdAt!}
                    author_id={comment.author_id!}
                    isSameAuthorAsPrevious={isSameAuthorAsPrevious}
                    article_id={article_id}
                    comment_id={comment._id!}
                    replies={comment.replies!}
                    author={comment.author!}
                    author_of_post={author_of_post}
                    onLevelTwoToggle={(isOpen) => handleLevelTwoToggle(comment._id!, isOpen)}
                    activeLevelTwoCommentId={activeLevelTwoCommentId}
                    article={article}
                  />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Pagination */}
        {article.type !== "Repost" && hasNextPage && (
          <motion.div 
            className="p-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2">
                  <LuLoader className="animate-spin text-sm" />
                  <span className="text-sm">Loading more...</span>
                </div>
              ) : (
                <span className="text-sm font-medium">Show More Comments</span>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentSection;
