import React from 'react';
import { Publication } from '../../../models/datamodels';
import { LuBadgeCheck } from 'react-icons/lu';
import { useGetPublicationAuthor } from '../Hooks';

interface AuthorsTabProps {
  stream: Publication;
}

const AuthorsTab: React.FC<AuthorsTabProps> = ({ stream }) => {
  // Get publication author
  const { data: authorData, isLoading, error } = useGetPublicationAuthor(stream._id || '');

  console.log('Author data:', authorData);
  console.log('Stream data:', stream);

  const author = authorData?.author;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="pb-10 space-y-6">
        <div className="bg-neutral-800 rounded-lg p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-neutral-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-neutral-700 rounded w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="pb-10 space-y-6">
        <div className="bg-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-400 text-center">
              <p>Error loading author</p>
              <p className="text-sm mt-1">Unable to load author information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = author?.name || author?.username || 'Unknown';
  const displayBio = author?.bio || 'No bio available';
  const profilePicture = author?.profile_picture;
  const isVerified = author?.is_verified_writer || false;

  return (
    <div className="pb-10 space-y-6">
      <div className="bg-neutral-800 rounded-lg p-6 hover:bg-neutral-750 transition-colors">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-400 flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(displayName)}
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-neutral-50 truncate">{displayName}</h4>
              {isVerified && (
                <LuBadgeCheck className="w-4 h-4 text-primary-400 flex-shrink-0" />
              )}
            </div>
            
            <p className="text-neutral-300 text-sm mb-2">@{author?.username}</p>
            <p className="text-neutral-200 text-sm mb-2 line-clamp-2">{displayBio}</p>
            
            {author?.address && (
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
                <span>📍 {author.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsTab;