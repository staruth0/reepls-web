import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAllRepostComments } from '../../Repost/hooks/useRepost';

interface RepostsCommentarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const RepostsCommentarySidebar: React.FC<RepostsCommentarySidebarProps> = ({ isOpen, onClose, articleId }) => {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const {
    data: commentsData,
    isLoading,
    error,
    isError,
  } = useAllRepostComments();

  useEffect(() => {
    console.log("article", articleId);
    console.log(commentsData);
  }, [commentsData, articleId]);

  const toggleExpand = (id: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const MAX_COMMENT_LINES = 3;

  // Determines if comment needs truncation based on line breaks or length
  const needsTruncation = (text: string, maxLines: number, charLimit: number = 150) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    return lineBreaks >= maxLines || text.length > charLimit;
  };

  // Formats timestamp to relative time string
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Filter repost comments for the current articleId
  const filteredReposts = commentsData?.data?.filter(
    (repost: any) => repost.article._id === articleId
  ) || [];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[var(--background)] shadow-lg transform transition-transform duration-300 ease-in-out z-50
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 border-b border-[var(--neutral-700)] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--plain-a)]">Repost Commentaries</h2>
        <button
          onClick={onClose}
          className="text-[var(--neutral-300)] hover:text-[var(--plain-a)] focus:outline-none"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)] 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-400)] mb-4" />
            <p className="text-[var(--neutral-300)] text-center">
              Loading commentaries...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-400 text-center mb-2">
              Failed to load commentaries
            </p>
            <p className="text-[var(--neutral-400)] text-sm text-center">
              {error?.message || 'Please try again later'}
            </p>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !isError && filteredReposts.length > 0 ? (
          filteredReposts.map((repost: any) => {
            const isExpanded = expandedComments.has(repost.repost_id);
            const user = repost.user;
            const firstNameInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            const commentText = repost.comment || '';
            const shouldTruncate = needsTruncation(commentText, MAX_COMMENT_LINES, 150);
            const bio = user.bio || '';

            return (
              <div
                key={repost.repost_id}
                className="mb-4 p-3 bg-[var(--background)] shadow-md rounded-lg border border-[var(--neutral-700)]"
              >
                {/* User profile section */}
                <div className="flex items-center gap-3 mb-2">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-400)] flex items-center justify-center text-[var(--plain-b)] font-bold text-lg">
                      {firstNameInitial}
                    </div>
                  )}

                  <div>
                    <a
                      href={`/profile/${user.username}`}
                      className="font-bold text-[var(--plain-a)] hover:underline cursor-pointer"
                      title={`Visit ${user.name}'s profile`}
                    >
                      {user.name}
                    </a>
                    {bio && (
                      <p className="text-[var(--neutral-400)] text-xs mt-0.5">{bio}</p>
                    )}
                  </div>
                </div>

                {/* Comment content */}
                <div className="relative">
                  <p
                    className={`text-[var(--neutral-100)] text-sm whitespace-pre-line ${
                      !isExpanded && shouldTruncate ? 'line-clamp-3' : ''
                    }`}
                  >
                    {commentText}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(repost.repost_id)}
                      className="text-[var(--primary-400)] text-sm mt-1 hover:underline focus:outline-none"
                      aria-label={isExpanded ? 'Show less comment' : 'Show more comment'}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>

                {/* Repost time */}
                <p className="text-[var(--neutral-400)] text-xs mt-2">
                  {formatTimestamp(repost.repostedAt)}
                </p>
              </div>
            );
          })
        ) : !isLoading && !isError ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[var(--neutral-300)] text-center">
              No repost commentaries yet for this article.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RepostsCommentarySidebar;
