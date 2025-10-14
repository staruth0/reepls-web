import React, { useState } from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';

import { timeAgo } from '../../../utils/dateFormater';
import { User } from '../../../models/datamodels';

interface PodcastComment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: {
    _id: string;
    name: string;
  } | null;
  podcastId: string;
  parentCommentId: string | null;
  isAudioComment: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  likesCount: number;
  repliesCount: number;
  __v: number;
}

interface PodcastCommentProps {
  comment: PodcastComment;
  podcastAuthor: User;
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

const PodcastComment: React.FC<PodcastCommentProps> = ({
  comment,
 
  onReply,
  onLike,
}) => {

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);

  const handleLike = () => {
    setIsLiked((like) => !like);
    setLikesCount((count) => (isLiked ? count - 1 : count + 1));
    onLike?.(comment._id);
  };

  // Handle case where authorId might be null
  if (!comment.authorId) {
    return (
      <div className="mb-4 px-4 py-3 bg-neutral-800 rounded-lg flex items-start gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold text-lg uppercase">
          ?
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-1">
            <span className="font-semibold text-neutral-400 text-[15px]">
              Unknown User
            </span>
            <span className="text-neutral-500 text-xs leading-tight">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <div className="text-neutral-300 text-sm mb-2 break-words">
            {comment.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 px-4 py-3 bg-neutral-800 rounded-lg flex items-start gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg uppercase">
        {comment.authorId.name?.charAt(0) || 'U'}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        {/* Username and Time */}
        <div className="flex flex-col mb-1">
          <span className="font-semibold text-neutral-100 text-[15px]">
            {comment.authorId.name}
          </span>
          <span className="text-neutral-400 text-xs leading-tight">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Comment body */}
        <div className="text-neutral-200 text-sm mb-2 break-words">
          {comment.content}
        </div>

        {/* Actions row */}
        <div className="flex gap-5 items-center text-neutral-400 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-neutral-100 transition-colors ${
              isLiked ? 'text-blue-400' : ''
            }`}
          >
            <ThumbsUp size={15} className={isLiked ? 'fill-current' : ''} />
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>
          <button
            onClick={() => onReply?.(comment._id)}
            className="flex items-center gap-1 hover:text-neutral-100 transition-colors"
          >
            <MessageCircle size={15} />
            {comment.repliesCount > 0 && <span>{comment.repliesCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastComment;
