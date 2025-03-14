import React, { useState } from 'react';
import { hand5, heart, thumb } from '../../../../assets/icons';
import { timeAgo } from '../../../../utils/dateFormater';
import { useGetCommentsByArticleId } from '../../../Comments/hooks';
import ReactionsPopup from '../../../Interactions/components/ReactionsPopup';
import { useGetArticleReactions } from '../../../Interactions/hooks';

interface BlogReactionStatsProps {
  date: string;
  toggleCommentSection?: () => void;
  article_id: string;
}



const BlogReactionStats: React.FC<BlogReactionStatsProps> = ({ date, toggleCommentSection, article_id }) => {
  const [showReactions, setShowReactions] = useState(false);

  const { data: articleComments } = useGetCommentsByArticleId(article_id);
  const { data: allReactions } = useGetArticleReactions(article_id);

  const handlecloseReactionPopup = () => {
    setShowReactions(false);
  };

  // Utility function to calculate total comments
  const  totalComments = () => {
    if (!articleComments || !articleComments.pages) return 0;
  
    return articleComments.pages.reduce((total, page) => {
      return total + (page.data?.commentsTree?.length || 0);
    }, 0);
  };

  return (
    <div className="flex justify-between items-center p-4 text-neutral-50 text-sm font-roboto">
      {/* Reaction Section */}
      <div className="flex items-center gap-2 h-[30px] relative cursor-pointer">
        <div className="flex gap-0 items-center">
          {/* Stacked Icons */}
          <div className="flex relative">
            <img
              src={heart}
              alt="heart"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-50 -ml-1"
            />
            <img
              src={thumb}
              alt="thumb"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-30 -ml-2"
            />
            <img
              src={hand5}
              alt="hand"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-20 -ml-2"
            />
          </div>
          {/* Reaction Count */}
          <div
            className="ml-1 hover:underline underline-offset-1 "
            onClick={() => setShowReactions(true)}
          >
            {allReactions?.reactions?.length}
          </div>
        </div>

        {/* Comments Count */}
        <div
          className="ml-4 text-neutral-50 hover:text-primary-500 hover:underline underline-offset-1"
          onClick={toggleCommentSection}
        >
          {totalComments()} Comments
        </div>
      </div>

      {showReactions && (
        <ReactionsPopup
          isOpen={showReactions}
          onClose={handlecloseReactionPopup}
          article_id={article_id}
        />
      )}

      {/* Time Posted */}
      <div className="text-neutral-70 text-xs mx-1"> • {timeAgo(date)}</div>
    </div>
  );
};

export default BlogReactionStats;