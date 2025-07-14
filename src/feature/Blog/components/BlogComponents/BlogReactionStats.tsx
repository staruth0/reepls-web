import React, { useState, useEffect } from "react";
import { PenLine } from "lucide-react"; // Removed Dot import
import { hand5, heart, thumb } from "../../../../assets/icons";
import { useGetCommentsByArticleId } from "../../../Comments/hooks";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import { useGetArticleReactions } from "../../../Interactions/hooks";
import { t } from "i18next";
// import { calculateReadTime } from "../../../../utils/articles";
import { Article } from "../../../../models/datamodels";
import { motion } from "framer-motion";
import { cn } from "../../../../utils";


interface BlogReactionStatsProps {
  date: string;
  toggleCommentSection?: () => void;
  article_id: string;
  article: Article;
}

const BlogReactionStats: React.FC<BlogReactionStatsProps> = ({
  toggleCommentSection,
  article_id,
  // date, 
  // article 
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showNoReactionsPopup, setShowNoReactionsPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { data: articleComments, isLoading: commentsLoading } =
    useGetCommentsByArticleId(article_id);
  const { data: allReactions, isLoading: reactionsLoading } =
    useGetArticleReactions(article_id);

  // Safely get total comments 
  const totalComments = articleComments?.pages?.[0]?.data?.totalComments || 0; // Default to 0 if undefined
  const reactionCount = allReactions?.reactions?.length || 0;


  const repostCount = 0;

  // Handle screen width detection
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
      setTimeout(() => setShowNoReactionsPopup(false), 3000); // Auto-close after 3 seconds
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
                {/* Display reactions only if there are any */}
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
          {/* Reaction Count */}
          {reactionsLoading ? (
            <div className='w-6 h-4 bg-neutral-500 rounded-md animate-pulse ml-1' />
          ) : (
            // Always show 0 if no reactions, otherwise formatted count
            <div className='ml-1 text-neutral-50 group-hover:text-primary-500 group-hover:underline underline-offset-1'>
              {reactionCount === 0 ? "0" : reactionCount >= 1000 ? `${(reactionCount / 1000).toFixed(1)}k` : reactionCount}
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

        {/* Separator */}
        {(totalComments > 0 || reactionCount > 0) && repostCount > 0 && (
          <span className="text-neutral-300">•</span> 
        )}

        {/* Reposts Section */}
        {repostCount > 0 && (
          <div className="flex gap-1 items-center group cursor-pointer">
            <span className='text-neutral-50 group-hover:text-primary-500 group-hover:underline underline-offset-1'>
              {repostCount} {t("reposts", { count: repostCount })} 
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogReactionStats;