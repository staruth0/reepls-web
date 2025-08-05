// src/components/molecules/PodcastCard/PodcastAuthorInfo.tsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // For the verified badge

interface PodcastAuthorInfoProps {
  authorName: string;
  authorAvatarUrl: string;
  isVerified: boolean;
  onFollowClick: () => void;
  isFollowing: boolean; // Added to manage follow state
}

const PodcastAuthorInfo: React.FC<PodcastAuthorInfoProps> = ({
  authorName,
  authorAvatarUrl,
  isVerified,
  onFollowClick,
  isFollowing,
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Author Avatar */}
      <img
        src={authorAvatarUrl}
        alt={`${authorName}'s avatar`}
        className="w-8 h-8 rounded-full object-cover bg-neutral-600" // Added bg for placeholder
        onError={(e) => {
          // Fallback to a generic user icon if image fails to load
          e.currentTarget.src = 'https://placehold.co/32x32/333333/FFFFFF?text=User';
        }}
      />
      {/* Author Name and Verification */}
      <div className="flex items-center gap-1">
        <span className="text-[12px] font-medium text-neutral-50">{authorName}</span>
        {isVerified && (
          <FaCheckCircle className="text-primary-400 text-xs" title="Verified" />
        )}
      </div>
      {/* Follow Button */}
      <button
        onClick={onFollowClick}
        className={`ml-2 px-3 py-1 text-xs font-semibold transition-colors duration-200
          ${isFollowing
            ? 'text-neutral-700  hover:neutral-600'
            : 'text-primary-400  hover:text-primary-500'
          }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default PodcastAuthorInfo;