import React, { useState } from "react";
import PodcastAuthorInfo from "./PodcastAuthorInfo"; 
import PodcastEngagementMetrics from "./PodcastEngagementMetrics"; 

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

  onLike?: (podcastId: string) => void;
  onComment?: (podcastId: string) => void;
  onBookmark?: (podcastId: string) => void;
  onFollow?: (authorId: string) => void;
}

const PodcastCard2: React.FC<PodcastCardProps> = ({
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
    setIsBookmarked((prev) => !prev); // Toggle local state
    console.log(`Bookmark toggled for podcast: ${podcast.id}`);
    if (onBookmark) onBookmark(podcast.id);
  };

  const handleFollowClick = () => {
    setIsFollowing((prev) => !prev); // Toggle local state
    console.log(`Follow toggled for author: ${podcast.author.id}`);
    if (onFollow) onFollow(podcast.author.id);
  };

  return (
    <div className="bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-neutral-700 flex flex-col p-2">
    
      <div className="flex flex-row-reverse items-start gap-4 mb-4"> 
       
        <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-md"> 
          <img
            src={podcast.thumbnailUrl}
            alt={podcast.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/128x128/444444/FFFFFF?text=Thumb`;
            }}
          />
        </div>

      
        <div className="flex-1 min-w-0"> 
          {/* Author Info */}
          <PodcastAuthorInfo
            authorName={podcast.author.name}
            authorAvatarUrl={podcast.author.avatarUrl}
            isVerified={podcast.author.isVerified}
            onFollowClick={handleFollowClick}
            isFollowing={isFollowing}
          />

          {/* Podcast Title */}
          <h2 className="text-[16px] font-bold text-neutral-50 mb-2 line-clamp-2 break-words">
            {podcast.title}
          </h2>

          {/* Podcast Description */}
          <p className="text-neutral-300 text-[12px] mb-4 line-clamp-3 break-words">
            {podcast.description}
          </p>
        </div>
      </div>

     
      <div className="flex items-center justify-between mt-auto"> 
        {/* Date and Listen Time */}
        <div className="flex items-center gap-2 text-neutral-50 text-[13px] font-bold">
          <span>{podcast.publishDate}</span>
          <span className="w-1 h-1 bg-neutral-500 rounded-full "></span>
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
  );
};

export default PodcastCard2;