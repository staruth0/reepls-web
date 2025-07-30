// src/components/molecules/PodcastCard/PodcastCard.tsx
import React, { useState } from 'react';
import PodcastAuthorInfo from './PodcastAuthorInfo'; // Adjust path as needed
import PodcastEngagementMetrics from './PodcastEngagementMetrics'; // Adjust path as needed

// Define the interface for the podcast data
interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  title: string;
  description: string;
  publishDate: string; // e.g., "Jun 26"
  listenTime: string; // e.g., "32 min"
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

interface PodcastCardProps {
  podcast: Podcast;
  // Optional handlers for actions, if you want to lift state up
  onLike?: (podcastId: string) => void;
  onComment?: (podcastId: string) => void;
  onBookmark?: (podcastId: string) => void;
  onFollow?: (authorId: string) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  onLike,
  onComment,
  onBookmark,
  onFollow,
}) => {
  // Local state for bookmark and follow, if not managed globally
  const [isBookmarked, setIsBookmarked] = useState(podcast.isBookmarked);
  const [isFollowing, setIsFollowing] = useState(false); // Assuming initial state is not following

  const handleLikeClick = () => {
    // Implement like logic, e.g., call API, then update parent state or local state
    console.log(`Liked podcast: ${podcast.id}`);
    if (onLike) onLike(podcast.id);
  };

  const handleCommentClick = () => {
    // Implement comment logic, e.g., navigate to comments section
    console.log(`Commented on podcast: ${podcast.id}`);
    if (onComment) onComment(podcast.id);
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(prev => !prev); // Toggle local state
    console.log(`Bookmark toggled for podcast: ${podcast.id}`);
    if (onBookmark) onBookmark(podcast.id);
  };

  const handleFollowClick = () => {
    setIsFollowing(prev => !prev); // Toggle local state
    console.log(`Follow toggled for author: ${podcast.author.id}`);
    if (onFollow) onFollow(podcast.author.id);
  };

  return (
    <div className="bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-neutral-700 h-full flex flex-col">
      {/* Podcast Thumbnail Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={podcast.thumbnailUrl}
          alt={podcast.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a placeholder image if the actual image fails
            e.currentTarget.src = `https://placehold.co/400x200/444444/FFFFFF?text=Podcast+Thumbnail`;
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Author Info */}
        <PodcastAuthorInfo
          authorName={podcast.author.name}
          authorAvatarUrl={podcast.author.avatarUrl}
          isVerified={podcast.author.isVerified}
          onFollowClick={handleFollowClick}
          isFollowing={isFollowing}
        />

        {/* Podcast Title */}
        <h2 className="text-[16px] font-bold text-neutral-50 mb-2 line-clamp-2">
          {podcast.title}
        </h2>

        {/* Podcast Description */}
        <p className="text-neutral-300 text-[12px] mb-4 line-clamp-3">
          {podcast.description}
        </p>

        {/* Date, Listen Time, and Engagement Metrics */}
        {/* This div will be pushed to the bottom by justify-between on parent */}
        <div className='flex items-center justify-between mt-2'>
          {/* Date and Listen Time */}
          <div className="flex items-center gap-2 text-neutral-50 text-[13px] font-bold">
            <span>{podcast.publishDate}</span>
            <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
            <span>{podcast.listenTime}</span>
          </div>

          {/* Engagement Metrics */}
          <PodcastEngagementMetrics
            likes={podcast.likes}
            comments={podcast.comments}
            isBookmarked={isBookmarked}
            onLikeClick={handleLikeClick}
            onCommentClick={handleCommentClick}
            onBookmarkClick={handleBookmarkClick}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;