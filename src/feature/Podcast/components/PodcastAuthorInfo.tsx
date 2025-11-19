import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../models/datamodels';
import { useFollowUser } from '../../../hooks/useFollowUser';
import { useUser } from '../../../hooks/useUser';

interface PodcastAuthorInfoProps {
  author: User | null;
}

const PodcastAuthorInfo: React.FC<PodcastAuthorInfoProps> = ({ author }) => {
  const navigate = useNavigate();
  const {
    isFollowing,
    toggleFollow,
    isFollowPending,
    isUnfollowPending
  } = useFollowUser({ targetUserId: author?.id || '' });

  const {authUser} = useUser()

  // Return null if author is not available
  if (!author) {
    return null;
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${author.username}`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Follow toggled for author: ${author.id}`);
    toggleFollow();
  };

  // Decide button label
  let buttonLabel = isFollowing ? 'Following' : 'Follow';
  if (isFollowPending) {
    buttonLabel = 'Following...';
  } else if (isUnfollowPending) {
    buttonLabel = 'Unfollowing...';
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleAuthorClick}
      >
        <img
          src={author.profile_picture || 'https://placehold.co/32x32/333333/FFFFFF?text=User'}
          alt={`${author.name}'s avatar`}
          className="w-6 h-6 rounded-full object-cover bg-neutral-600"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/32x32/333333/FFFFFF?text=User';
          }}
        />
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-medium text-neutral-50">
            {author.name}
          </span>
          {author.is_verified_writer && (
            <FaCheckCircle
              className="text-primary-400 text-xs"
              title="Verified"
            />
          )}
        </div>
      </div>

 { authUser?.id && authUser.id !== author.id &&     <button
        onClick={handleFollowClick}
        disabled={isFollowPending || isUnfollowPending}
        className={`ml-2 px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
          isFollowing
            ? 'text-neutral-400 hover:text-neutral-600'
            : 'text-primary-400 hover:text-primary-500'
        }`}
      >
        {buttonLabel}
      </button>}
    </div>
  );
};

export default PodcastAuthorInfo;
