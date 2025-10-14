import React, { useState, useEffect } from "react";
import { PenLine } from "lucide-react";
import { hand5, heart, thumb } from "../../../../assets/icons";
import { useGetCommentsByArticleId } from "../../../Comments/hooks";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import { useGetAllReactionsForTarget } from "../../../../feature/Repost/hooks/useRepost";
import { t } from "i18next";
import { Article } from "../../../../models/datamodels";
import { motion } from "framer-motion";
import { cn } from "../../../../utils";
import { useGetCommentsTreeForRepost } from "../../../Repost/hooks/useRepost";


interface BlogReactionStatsProps {
  date: string;
  toggleCommentSection?: () => void;
  article_id: string;
  article: Article;
}

const BlogReactionStats: React.FC<BlogReactionStatsProps> = ({
  toggleCommentSection,
  article_id,
  article,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showNoReactionsPopup, setShowNoReactionsPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { data: articleComments, isLoading: commentsLoading } = useGetCommentsByArticleId(article_id);
  const target_type = article.type === "Repost" ? "Repost" : "Article";
  const target_id = article.type === "Repost" && article.repost?.repost_id ? article.repost?.repost_id : article_id;

  const { data: allReactions, isLoading: reactionsLoading } = useGetAllReactionsForTarget(target_type, target_id);
const reactionCount = allReactions?.data?.totalReactions || 0;
  const {
    data: repostComments,

  } = useGetCommentsTreeForRepost(article.repost?.repost_id || "");

  // Use repost total comments if article is a repost, else regular
  const totalComments = article.type === "Repost"
    ? repostComments?.parentCommentsCount ?? 0
    : articleComments?.pages?.[0]?.data?.totalComments ?? 0;

  
  // const repostCount = 0; // Keep your existing logic or update as necessary

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseReactionPopup = () => {
    setShowReactions(false);
  };

  const handleReactionClick = () => {
    if (reactionCount === 0 && !reactionsLoading) {
      setShowNoReactionsPopup(true);
      setTimeout(() => setShowNoReactionsPopup(false), 3000);
    } else {
      setShowReactions(true);
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className='flex justify-between items-center p-4 text-neutral-50 text-sm font-roboto'>
      {/* Reaction Section */}
      <div className='flex items-center gap-2 h-[30px] relative'>
        <div
          className='flex gap-0 items-center group cursor-pointer'
          onClick={handleReactionClick}
        >
          <div className='flex relative'>
            {reactionsLoading ? (
              <div className='flex gap-1 -ml-1'>
                <div className='w-5 h-5 bg-neutral-500 rounded-full animate-pulse' />
                <div className='w-5 h-5 bg-neutral-500 rounded-full animate-pulse -ml-2' />
                <div className='w-5 h-5 bg-neutral-500 rounded-full animate-pulse -ml-2' />
              </div>
            ) : (
              <>
                {reactionCount >= 0 && (
                  <>
                    <img
                      src={heart}
                      alt='heart'
                      className='w-5 h-5 rounded-full shadow-md transform transition-transform relative z-50 -ml-1'
                    />
                    <img
                      src={thumb}
                      alt='thumb'
                      className='w-5 h-5 rounded-full shadow-md transform transition-transform relative z-30 -ml-2'
                    />
                    <img
                      src={hand5}
                      alt='hand'
                      className='w-5 h-5 rounded-full shadow-md transform transition-transform relative z-20 -ml-2'
                    />
                  </>
                )}
              </>
            )}
          </div>
          {reactionsLoading ? (
            <div className='w-6 h-4 bg-neutral-500 rounded-md animate-pulse ml-1' />
          ) : (
            <div className='ml-1 text-neutral-50 group-hover:text-primary-500 group-hover:underline underline-offset-1'>
              {reactionCount === 0
                ? "0"
                : reactionCount >= 1000
                ? `${(reactionCount / 1000).toFixed(1)}k`
                : reactionCount}
            </div>
          )}
        </div>

        {/* No Reactions Popup */}
        {showNoReactionsPopup && (
          <motion.div
            className={cn(
              "absolute top-0 right-12 w-64 p-4 rounded-lg shadow-lg bg-background",
              "z-50"
            )}
            variants={popupVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <p className='text-sm font-light leading-relaxed'>
              No reactions to view yet
            </p>
            <button
              onClick={() => setShowNoReactionsPopup(false)}
              className='mt-2 text-xs underline hover:text-primary-200 transition-colors'
            >
              {t("Got it!")}
            </button>
          </motion.div>
        )}
      </div>

      {showReactions && reactionCount > 0 && (
        <ReactionsPopup
          isOpen={showReactions}
          onClose={handleCloseReactionPopup}
          article_id={article_id}
          article={article}
        />
      )}

      <div className="flex items-center text-neutral-50 text-sm space-x-1">
        {/* Comments Section */}
        <div
          className='flex items-center gap-1 group cursor-pointer'
          onClick={toggleCommentSection}
        >
          {commentsLoading ? (
            <div className='flex items-center gap-1'>
              <div className='w-4 h-4 bg-neutral-500 rounded-full animate-pulse' />
              <div className='w-20 h-4 bg-neutral-500 rounded-md animate-pulse' />
            </div>
          ) : (
            <>
              {totalComments > 0 ? (
                <span className="group-hover:text-primary-500 group-hover:underline underline-offset-1">
                  {totalComments} {t("blog.Comments", { count: totalComments })}
                </span>
              ) : (
                <span className="group-hover:text-primary-500 group-hover:underline underline-offset-1">
                  <PenLine size={16} className="inline-block mr-1 group-hover:text-primary-500" />
                  {isSmallScreen ? t("Your thoughts?") : t("What are your thoughts")}
                </span>
              )}
            </>
          )}
        </div>

        {/* Separator and repost count - add logic as needed */}
      </div>
    </div>
  );
};

export default BlogReactionStats;
