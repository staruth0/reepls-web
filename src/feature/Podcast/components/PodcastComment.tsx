import React from 'react';

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
}) => {

  // Handle case where authorId might be null
  if (!comment.authorId) {
    return (
      <div className="mb-4 px-4 py-3 bg-neutral-800 rounded-lg border border-neutral-700 shadow-sm flex items-start gap-3">
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
          <div className="text-neutral-300 text-sm break-words">
            {comment.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 px-4 py-3 bg-neutral-800 rounded-lg border border-neutral-700 shadow-sm flex items-start gap-3">
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
        <div className="text-neutral-200 text-sm break-words">
          {comment.content}
        </div>
      </div>
    </div>
  );
};

export default PodcastComment;
