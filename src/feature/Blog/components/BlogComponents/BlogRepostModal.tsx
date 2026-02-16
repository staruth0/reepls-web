import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, Share, User2 } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';
import { User, Article, MediaItem as ArticleMediaItem } from '../../../../models/datamodels';

import { LuLoader } from 'react-icons/lu';
import { useRepostArticle, useUpdateRepost } from '../../../Repost/hooks/useRepost';

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  article_id: string;
  article: Article;
  author_of_post: User;
  isEditMode?: boolean;
  repostId?: string;
  initialComment?: string;
}

interface RepostStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  onRetry?: () => void;
  isEdit?: boolean;
}

const RepostStatusModal: React.FC<RepostStatusModalProps> = ({
  isOpen,
  onClose,
  isSuccess,
  onRetry,
  isEdit = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[4000]">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4 text-foreground">
            {isSuccess ? (isEdit ? "Commentary Updated!" : "Republish Successful!") : (isEdit ? "Update Failed" : "Republish Failed")}
          </h3>
          <p className="mb-6 text-neutral-100">
            {isSuccess
              ? (isEdit 
                  ? "Your commentary has been updated successfully."
                  : "Your republish with thoughts has been shared successfully.")
              : "There was an error. Please try again."}
          </p>
          <div className="flex justify-center gap-4">
            {!isSuccess && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-400 text-background rounded hover:bg-primary-500 transition"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-600 transition text-neutral-50"
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
  article,
  author_of_post,
  isEditMode = false,
  repostId,
  initialComment = '',
}) => {
  const [thoughts, setThoughts] = useState('');
  const [repostStatus, setRepostStatus] = useState<{
    show: boolean;
    isSuccess: boolean;
  }>({ show: false, isSuccess: false });

  const { mutate: repost, isPending: isReposting } = useRepostArticle();
  const { mutate: updateRepost, isPending: isUpdating } = useUpdateRepost();
  

  // Set initial comment when in edit mode
  useEffect(() => {
    if (isEditMode && initialComment) {
      setThoughts(initialComment);
    } else if (!isEditMode) {
      setThoughts('');
    }
  }, [isEditMode, initialComment, isOpen]);

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
    if (isEditMode) {
      if (!repostId) {
        setRepostStatus({ show: true, isSuccess: false });
        return;
      }
      updateRepost(
        { repostId, comment: thoughts },
        {
          onSuccess: () => {
            onClose();
            setRepostStatus({ show: true, isSuccess: true });
          },
          onError: () => {
            setRepostStatus({ show: true, isSuccess: false });
          },
        }
      );
    } else {
      if (!article_id) {
        setRepostStatus({ show: true, isSuccess: false });
        return;
      }
      repost(
        { articleId: article_id, comment: thoughts },
        {
          onSuccess: () => {
            onClose();
            setRepostStatus({ show: true, isSuccess: true });
          },
          onError: () => {
            setRepostStatus({ show: true, isSuccess: false });
          },
        }
      );
    }
  };

  const handleRetryRepost = () => {
    setRepostStatus({ show: false, isSuccess: false });
    handleRepost();
  };

  const closeRepostStatusModal = () => {
    setRepostStatus({ show: false, isSuccess: false });
  };

  const isPending = isReposting || isUpdating;

  const renderImageGrid = (images: ArticleMediaItem[]) => {
    const imageCount = images?.length || 0;

    if (imageCount === 0) return null;

    if (imageCount === 1) {
      return (
        <div className="mb-4">
          <img
            src={images?.[0]?.url || ''}
            alt="Post image"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {images.map((mediaItem: ArticleMediaItem, index: number) => (
            <img
              key={mediaItem.url + index} 
              src={mediaItem.url}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          <img
            src={images?.[0]?.url || ''}
            alt="Post image 1"
            className="w-full h-40 object-cover rounded-lg row-span-2"
          />
          <div className="grid grid-rows-2 gap-2">
            {(images || []).slice(1, 3).map((mediaItem: ArticleMediaItem, index: number) => (
              <img
                key={mediaItem.url + index}
                src={mediaItem.url}
                alt={`Post image ${index + 2}`}
                className="w-full h-[76px] object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      );
    }

    if (imageCount >= 4) {
      return (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {(images || []).slice(0, 3).map((mediaItem: ArticleMediaItem, index: number) => (
            <img
              key={mediaItem.url + index}
              src={mediaItem.url}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
          <div className="relative">
            <img
              src={images?.[3]?.url || ''}
              alt="Post image 4"
              className="w-full h-32 object-cover rounded-lg"
            />
            {imageCount > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{imageCount - 4}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const ErrorState = () => (
    <div className="p-4">
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <div className="text-center">
          <p className="text-red-600 font-medium">Article data not available</p>
          <p className="text-red-500 text-sm mt-1">Please ensure the article data is passed correctly.</p>
        </div>
      </div>
    </div>
  );

  const isLoadingOrError = !article || (article.content === undefined && article.htmlContent === undefined && !article.media?.length);

  return (
    <>
      <RepostStatusModal
        isOpen={repostStatus.show}
        onClose={closeRepostStatusModal}
        isSuccess={repostStatus.isSuccess}
        onRetry={handleRetryRepost}
        isEdit={isEditMode}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-start sm:justify-center p-4"
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
              className="relative w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden sm:mx-auto lg:mx-0 flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-400 flex-shrink-0">
                <h2 className="text-lg font-semibold text-foreground">
                  {isEditMode ? 'Edit Commentary' : 'Republish'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-600 rounded-full transition-colors"
                >
                  <X size={20} className="text-neutral-100" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 min-h-0">
                {/* Thoughts Section */}
                <div className="p-4 border-b border-neutral-400">
                  <label htmlFor="thoughts" className="block text-sm font-medium text-neutral-50 mb-2">
                    {isEditMode ? 'Edit your thoughts' : 'Add your thoughts'}
                  </label>
                  <textarea
                    id="thoughts"
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    placeholder={isEditMode ? "Update your thoughts about this post..." : "What do you think about this post?"}
                    className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:ring-1 focus:ring-primary-400 focus:border-transparent transition-all bg-background text-foreground"
                    rows={3}
                  />
                </div>

                {/* Original Post */}
                {isLoadingOrError ? (
                  <div>
                    {isLoadingOrError && !article ? (
                      <ErrorState />
                    ) : (
                      <FaSpinner className="animate-spin text-neutral-200 mx-auto my-4" />
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="border border-neutral-400 rounded-lg p-4 bg-neutral-700">
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
                            <User2 size={20} className="text-neutral-100" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {author_of_post?.name || 'Unknown Author'}
                          </h3>
                          <p className="text-sm text-neutral-100">
                            @{author_of_post?.username || 'unknown'} • {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        {/* <div className="ml-auto">
                          <button className="p-1 hover:bg-neutral-600 rounded-full transition-colors">
                            <MoreHorizontal size={16} className="text-neutral-100" />
                          </button>
                        </div> */}
                      </div>

                      {/* Post Title or Content */}
                      <div className="mb-4">
                        {article.title ? (
                          <h4 className="text-foreground font-semibold leading-relaxed">
                            {article.title}
                          </h4>
                        ) : (
                          <p className="text-foreground leading-relaxed line-clamp-2">
                            {article.content || 'No content available'}
                          </p>
                        )}
                      </div>

                      {/* Post Images - Professional Grid */}
                      {article.media && article.media.length > 0 && (
                        renderImageGrid((article.media || []).filter((item: ArticleMediaItem) => item.type === 'image'))
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-400">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 text-neutral-100 transition-colors">
                            <Heart size={18} />
                            <span className="text-sm">{article.reaction_count || 0}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-neutral-100  transition-colors">
                            <MessageCircle size={18} />
                            <span className="text-sm">{article.comment_count || 0}</span>
                          </div>

                          <div className="flex items-center space-x-2 text-neutral-100  transition-colors">
                            <Share size={18} />
                            <span className="text-sm">{article.shares_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-neutral-400 bg-neutral-700 flex-shrink-0">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-neutral-100 hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRepost}
                    disabled={isPending}
                    className="px-6 py-2 !bg-primary-400 !text-white rounded-lg hover:bg-primary-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <LuLoader className="animate-spin inline-block mr-2" size={16} />
                        {isEditMode ? 'Updating...' : 'Republishing...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Commentary' : 'Republish'
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