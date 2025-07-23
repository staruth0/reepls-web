import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, Share, User2 } from 'lucide-react';
import { useGetArticleById } from '../../hooks/useArticleHook';
import { FaSpinner } from 'react-icons/fa';
import { User } from '../../../../models/datamodels';
import { useRepostArticle } from '../../../Repost/hooks/useRepost';
import { LuLoader } from 'react-icons/lu';

interface MediaItem {
  _id: string;
  type: 'image' | 'video';
  url: string;
}

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  article_id: string;
  author_of_post: User;
}

interface RepostStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  onRetry?: () => void;
}

const RepostStatusModal: React.FC<RepostStatusModalProps> = ({
  isOpen,
  onClose,
  isSuccess,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[4000]">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">
            {isSuccess ? "Repost Successful!" : "Repost Failed"}
          </h3>
          <p className="mb-6">
            {isSuccess
              ? "Your repost with thoughts has been shared successfully."
              : "There was an error reposting. Please try again."}
          </p>
          <div className="flex justify-center gap-4">
            {!isSuccess && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-500 rounded hover:bg-neutral-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogRepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  onClose,
  article_id,
  author_of_post,
}) => {
  const [thoughts, setThoughts] = useState('');
  const [repostStatus, setRepostStatus] = useState<{
    show: boolean;
    isSuccess: boolean;
  }>({ show: false, isSuccess: false });

  // Fetch article data
  const { data: article, isLoading, error } = useGetArticleById(article_id);

  // Initialize the repost mutation hook
  const { mutate: repost, isPending: isReposting } = useRepostArticle(); 

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRepost = () => {
    repost(
      { articleId: article_id, comment: thoughts },
      {
        onSuccess: () => {
          onClose(); // Close modal on successful repost
          setRepostStatus({ show: true, isSuccess: true });
        },
        onError: () => {
          setRepostStatus({ show: true, isSuccess: false });
        },
      }
    );
  };

  const handleRetryRepost = () => {
    setRepostStatus({ show: false, isSuccess: false });
    handleRepost();
  };

  const closeRepostStatusModal = () => {
    setRepostStatus({ show: false, isSuccess: false });
  };

  // Render image grid based on count
  const renderImageGrid = (images: MediaItem[]) => {
    const imageCount = images.length;

    if (imageCount === 0) return null;

    if (imageCount === 1) {
      return (
        <div className="mb-4">
          <img
            src={images[0].url}
            alt="Post image"
            className="w-full h-64 object-cover rounded-md"
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {images.map((mediaItem: MediaItem, index: number) => (
            <img
              key={mediaItem._id || index}
              src={mediaItem.url}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <img
            src={images[0].url}
            alt="Post image 1"
            className="w-full h-40 object-cover rounded-md row-span-2"
          />
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((mediaItem: MediaItem, index: number) => (
              <img
                key={mediaItem._id || index}
                src={mediaItem.url}
                alt={`Post image ${index + 2}`}
                className="w-full h-[76px] object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      );
    }

    if (imageCount >= 4) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {images.slice(0, 3).map((mediaItem: MediaItem, index: number) => (
            <img
              key={mediaItem._id || index}
              src={mediaItem.url}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
          <div className="relative">
            <img
              src={images[3].url}
              alt="Post image 4"
              className="w-full h-32 object-cover rounded-md"
            />
            {imageCount > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{imageCount - 4}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // Error state
  const ErrorState = () => (
    <div className="p-4">
      <div className="border border-red-300 rounded-md p-4 bg-red-100">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load article</p>
          <p className="text-red-500 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <RepostStatusModal
        isOpen={repostStatus.show}
        onClose={closeRepostStatusModal}
        isSuccess={repostStatus.isSuccess}
        onRetry={handleRetryRepost}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleOverlayClick}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-[600px] max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-500">
                <h2 className="text-lg font-semibold text-foreground">Repost</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-600 rounded-full transition-colors"
                >
                  <X size={20} className="text-neutral-200" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Thoughts Section */}
                <div className="p-4">
                  <label htmlFor="thoughts" className="block text-sm font-medium text-foreground mb-2">
                    Add your thoughts
                  </label>
                  <textarea
                    id="thoughts"
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    placeholder="What do you think about this post?"
                    className="w-full p-3 border border-neutral-500 rounded-md resize-none focus:ring-1 focus:ring-primary-400 focus:border-transparent transition-all bg-background text-foreground placeholder-neutral-300"
                    rows={3}
                  />
                </div>

                {/* Original Post */}
                {isLoading ? (
                  <div>
                    <FaSpinner className="animate-spin text-neutral-500 mx-auto my-4" />
                  </div>
                ) : error ? (
                  <ErrorState />
                ) : article ? (
                  <div className="p-4">
                    <div className="border border-neutral-500 rounded-md p-4 bg-neutral-700">
                      {/* Author Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-secondary-400 rounded-full flex items-center justify-center">
                          {author_of_post?.profile_picture ? (
                            <img
                              src={author_of_post.profile_picture}
                              alt={author_of_post.name || 'Author'}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User2 size={20} className="text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {author_of_post?.name || 'Unknown Author'}
                          </h3>
                          <p className="text-sm  text-neutral-300">
                            @{author_of_post?.username || 'unknown'} • {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-foreground leading-relaxed">
                          {article.content || 'No content available'}
                        </p>
                      </div>

                      {/* Post Images - Professional Grid */}
                      {article.media && article.media.length > 0 && (
                        renderImageGrid(article.media.filter((item: MediaItem) => item.type === 'image'))
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-500">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 text-neutral-200">
                            <Heart size={18} />
                            <span className="text-sm">{article.reactionCount || 0}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-neutral-200">
                            <MessageCircle size={18} />
                            <span className="text-sm">{article.commentCount || 0}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-neutral-200">
                            <Share size={18} />
                            <span className="text-sm">{article.shares_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-neutral-500 bg-background">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={handleRepost}
                    className="px-8 py-3 !bg-primary-400 !text-white rounded-full !hover:bg-primary-500 transition-colors font-medium"
                    disabled={isLoading || isReposting}
                  >
                    {isReposting ? (
                      <>
                        <LuLoader className="animate-spin inline-block mr-2" /> Reposting... 
                      </>
                    ) : (
                      'Repost now'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogRepostModal;