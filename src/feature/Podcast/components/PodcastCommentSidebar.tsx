import React, { useEffect, useState, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useGetPodcastComments, useAddCommentToPodcast } from '../hooks';
import { LuSend, LuLoader } from 'react-icons/lu';
import { useUser } from '../../../hooks/useUser';
import { toast } from 'react-toastify';
import { smile } from '../../../assets/icons';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useTheme from '../../../hooks/useTheme';
import { FaRegUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IPodcast, User } from '../../../models/datamodels';
import PodcastComment from './PodcastComment';

interface IPodcastComment {
  _id: string;
  authorId: {
    _id: string;
    name: string;
    // Add other author fields if needed
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  isAudioComment: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  likesCount: number;
  parentCommentId: string | null;
  podcastId: string;
  repliesCount: number;
  __v: number;
}

interface PodcastCommentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  podcastId: string;
  podcastAuthor: User; // Replace with proper type if needed
  podcast: IPodcast;   // Replace with proper type if needed
}

const PodcastCommentSidebar: React.FC<PodcastCommentSidebarProps> = ({
  isOpen,
  onClose,
  podcastId,
  podcastAuthor,
}) => {
  const { isLoggedIn } = useUser();
  const [comment, setComment] = useState<string>('');
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch podcast comments
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPodcastComments({
    podcastId,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    console.log('comments', commentsData);
  }, [commentsData]);

  // Add comment mutation
  const { mutate: addComment, isPending: isAddingComment } =
    useAddCommentToPodcast();

  useEffect(() => {
    if (isOpen && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = 'auto';
      commentInputRef.current.style.height = `${Math.min(commentInputRef.current.scrollHeight, 120)}px`;
    }
  }, [comment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && isLoggedIn) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      toast.error(t('You must be logged in to comment.'));
      return;
    }

    if (comment.trim() === '') {
      toast.error(t('Comment cannot be empty.'));
      return;
    }

    console.log('comment',   {
      podcastId,
      payload: {
        content: comment,
        isAudioComment: false,
      },
    },);

    addComment(
      {
        podcastId,
        payload: {
          content: comment,
          isAudioComment: false,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('Comment added successfully'));
          setComment('');
          refetch();
        },
        onError: (error) => {
          toast.error(t('Failed to add comment'));
          console.error(error.message);
        },
      }
    );
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0  z-40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-[9999]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isOpen}
      >
        {/* Close button at top right */}
        {isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-300 hover:text-neutral-50 focus:outline-none z-[9999]"
            aria-label="Close comments sidebar"
            type="button"
          >
            <X size={24} />
          </button>
        )}

        <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-50">Comments</h2>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-140px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary-400 mb-4" />
              <p className="text-neutral-300 text-center">Loading comments...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-red-400 text-center mb-2">Failed to load comments</p>
              <p className="text-neutral-400 text-sm text-center">{error?.message || 'Please try again later'}</p>
            </div>
          )}

          {/* Comments List */}
          {!isLoading && !isError && commentsData?.data?.comments?.length > 0 ? (
            (commentsData?.data?.comments || []).map((comment: IPodcastComment) => (
              <PodcastComment key={comment._id} comment={comment} podcastAuthor={podcastAuthor} />
            ))
          ) : (
            !isLoading &&
            !isError && (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-neutral-300 text-center">No comments yet. Be the first to comment!</p>
              </div>
            )
          )}
        </div>

        {/* Comment Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-700 bg-background">
          <div className="flex items-end w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors">
            <textarea
              placeholder={isLoggedIn ? t('What are your thoughts...') : t('Sign in to comment')}
              className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto max-h-[120px] rounded-full"
              value={comment}
              onChange={(e) => isLoggedIn && setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={commentInputRef}
              disabled={!isLoggedIn}
              rows={1}
            />
            {isLoggedIn && (
              <>
                {/* Emoji Button */}
                <div className="relative" ref={emojiPickerRef}>
                  <button
                    onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
                    className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
                    type="button"
                    aria-label="Toggle emoji picker"
                  >
                    <img src={smile} alt="Emoji Picker" className="w-6 h-6" />
                  </button>
                  {isEmojiPickerVisible && (
                    <div className="absolute z-10 bottom-12 right-0 bg-background rounded-lg shadow-lg">
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme={theme === 'light' ? Theme.LIGHT : Theme.DARK} />
                    </div>
                  )}
                </div>
                {/* Send Button */}
                <button
                  onClick={handleCommentSubmit}
                  className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
                  disabled={isAddingComment || comment.trim() === ''}
                  type="button"
                  aria-label="Send comment"
                >
                  {isAddingComment ? <LuLoader className="animate-spin inline-block mx-1" /> : <LuSend size={20} />}
                </button>
              </>
            )}
            {!isLoggedIn && (
              <button
                className="ml-2 flex items-center w-40 justify-center gap-2 py-1 text-neutral-50 rounded-md shadow-sm hover:bg-primary-700 transition-colors"
                onClick={() => navigate('/auth')}
              >
                <FaRegUserCircle size={16} className="text-main-green" />
                {t('Sign In')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PodcastCommentSidebar;
