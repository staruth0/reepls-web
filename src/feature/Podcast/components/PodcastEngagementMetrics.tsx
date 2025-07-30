// src/components/molecules/PodcastCard/PodcastEngagementMetrics.tsx
import React from 'react';
import { LuThumbsUp, LuMessageSquare, LuBookmark } from 'react-icons/lu'; // Icons for likes, comments, bookmark

interface PodcastEngagementMetricsProps {
  likes: number;
  comments: number;
  isBookmarked: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onBookmarkClick: () => void;
}

const PodcastEngagementMetrics: React.FC<PodcastEngagementMetricsProps> = ({
  likes,
  comments,
  isBookmarked,
  onLikeClick,
  onCommentClick,
  onBookmarkClick,
}) => {
  return (
    <div className="flex items-center justify-between gap-6 ">
     

      {/* Engagement Icons */}
      <div className="flex items-center gap-2 text-neutral-50">
        <button onClick={onLikeClick} className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200">
          <LuThumbsUp className="size-4" />
          <span className="text-sm">{likes}</span>
        </button>
        <button onClick={onCommentClick} className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200">
          <LuMessageSquare className="size-4" />
          <span className="text-sm">{comments}</span>
        </button>
      </div>

      {/* Bookmark Icon */}
      <button onClick={onBookmarkClick} className="hover:text-primary-400 transition-colors duration-200">
        <LuBookmark className={`size-5 ${isBookmarked ? 'text-primary-500 fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default PodcastEngagementMetrics;