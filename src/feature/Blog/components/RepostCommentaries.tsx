import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useGetCommentsTreeForArticle } from '../../Comments/hooks';
import { CommentNode } from '../../Comments/api';

interface RepostsCommentarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const RepostsCommentarySidebar: React.FC<RepostsCommentarySidebarProps> = ({
  isOpen,
  onClose,
  articleId,
}) => {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Use the new hook to fetch comments
  const { 
    data: commentsData, 
    isLoading, 
    error, 
    isError 
  } = useGetCommentsTreeForArticle(articleId, 1, 10, isOpen);

  useEffect(() => {
    console.log("article",articleId);
    console.log(commentsData);
  }, [commentsData,articleId]);

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

  const MAX_COMMENT_LINES = 2;

  const needsTruncation = (text: string, maxLines: number, charLimit: number = 100) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    return lineBreaks >= maxLines || text.length > charLimit;
  };

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
        {!isLoading && !isError && commentsData?.data?.commentsTree && commentsData.data.commentsTree.length > 0 ? (
          commentsData.data.commentsTree.map((comment: CommentNode) => {
            const isExpanded = expandedComments.has(comment._id);
            const firstNameInitial = comment.author.name.split(' ')[0].charAt(0).toUpperCase();
            const shouldTruncate = needsTruncation(comment.content, MAX_COMMENT_LINES, 100);

            return (
              <div 
                key={comment._id} 
                className="mb-4 p-3 bg-[var(--background)] shadow-md rounded-lg border border-[var(--neutral-700)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  {comment.author.profile_picture ? (
                    <img
                      src={comment.author.profile_picture}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-400)] flex items-center justify-center text-[var(--plain-b)] font-bold text-lg">
                      {firstNameInitial}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[var(--plain-a)]">{comment.author.name}</p>
                    {comment.author.role && (
                      <p className="text-[var(--neutral-200)] text-xs capitalize">{comment.author.role}</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <p
                    className={`text-[var(--neutral-100)] text-sm ${
                      !isExpanded && shouldTruncate ? 'line-clamp-2' : ''
                    }`}
                  >
                    {comment.content}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(comment._id)}
                      className="text-[var(--primary-400)] text-sm mt-1 hover:underline focus:outline-none"
                      aria-label={isExpanded ? 'Show less comment' : 'Show more comment'}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>

                <p className="text-[var(--neutral-400)] text-xs mt-2">
                  {formatTimestamp(comment.createdAt)}
                </p>

                {/* Show replies count if there are any */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--neutral-700)]">
                    <p className="text-[var(--neutral-400)] text-xs">
                      {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                    </p>
                  </div>
                )}
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