import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Picker, { Theme } from 'emoji-picker-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader, LuTag } from 'react-icons/lu';
import { X, MoreVertical, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import TagsModal from './TagsModal';
import {
  allowedImageTypes,
  allowedVideoTypes,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  SHORT_POST_LENGTH,
} from '../../../constants';
import useTheme from '../../../hooks/useTheme';
import { cn } from '../../../utils';
import { useUser } from '../../../hooks/useUser';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import { useGetArticleById, useUpdateArticle } from '../../../feature/Blog/hooks/useArticleHook';
import { Article, MediaItem, MediaType } from '../../../models/datamodels';
import { uploadPostImage, uploadPostVideo } from '../../../utils/media';
import smile from '../../../assets/images/smile.png';
import image from '../../../assets/images/image-02.png';
import video from '../../../assets/images/video-02.png';

const PostEditModal = ({
  isModalOpen,
  setIsModalOpen,
  articleId,
  isPending: externalPending,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  articleId: string;
  isPending?: boolean;
}) => {
  const [postContent, setPostContent] = useState<string>('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn, authUser } = useUser();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const { data: article, isLoading: isFetching } = useGetArticleById(articleId);
  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle();

  const isPending = externalPending || isUpdating || isFetching;

  useEffect(() => {
    if (article) {
      setPostContent(article.content || '');
      const images = article.media?.filter((m: MediaItem) => m.type === MediaType.Image) || [];
      const videos = article.media?.filter((m: MediaItem) => m.type === MediaType.Video) || [];
      setExistingMedia([...images, ...videos]);
      setPostImages([]);
      setPostVideos([]);
      setIsCommunique(article.isCommunique || false);
      setTags(article.tags || []);
    }
  }, [article]);

  useEffect(() => {
    const ta = textareaRef.current;
    const hl = highlightRef.current;
    if (!ta || !hl) return;

    const onScroll = () => {
      // Use requestAnimationFrame for smoother scrolling on mobile
      requestAnimationFrame(() => {
        hl.scrollTop = ta.scrollTop;
        hl.scrollLeft = ta.scrollLeft;
      });
    };

    // Add both scroll and touchmove events for better mobile support
    ta.addEventListener('scroll', onScroll, { passive: true });
    ta.addEventListener('touchmove', onScroll, { passive: true });
    
    return () => {
      ta.removeEventListener('scroll', onScroll);
      ta.removeEventListener('touchmove', onScroll);
    };
  }, [postContent, article]); // Re-run when content or article changes to ensure scroll sync works

  // Reset submitting state when pending becomes false (submission completed)
  useEffect(() => {
    if (!isPending && isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isPending, isSubmitting]);

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsSubmitting(false);
    }
  }, [isModalOpen]);

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const buildHighlightedHtml = (text: string) => {
    if (!text) return '';
    let escaped = escapeHtml(text);
    escaped = escaped.replace(/(#\w+)/g, '<span class="text-green-500">$1</span>');
    escaped = escaped.replace(/\n/g, '<br/>');
    return escaped;
  };

  const handleActionBlocked = (action: string) => {
    if (!isLoggedIn) {
      setShowSignInPopup(action);
      return true;
    }
    return false;
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleActionBlocked('upload an image')) return;
    const files = e.target.files;
    if (!files) return;
    const newImages: File[] = [];
    for (const file of files) {
      if (file.type && allowedImageTypes.includes(file.type.split('/')[1])) {
        newImages.push(file);
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error('Image size must be less than ' + MAX_IMAGE_SIZE / 1024 / 1024 + ' MB');
        return;
      }
    }
    setPostImages([...postImages, ...newImages]);
  };

  const onPickVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleActionBlocked('upload a video')) return;
    const files = e.target.files;
    if (!files) return;
    const newVideos: File[] = [];
    for (const file of files) {
      if (file.type && allowedVideoTypes.includes(file.type.split('/')[1])) {
        newVideos.push(file);
      }
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error('Video size must be less than ' + MAX_VIDEO_SIZE / 1024 / 1024 + ' MB');
        return;
      }
    }
    setPostVideos([...postVideos, ...newVideos]);
  };

  const handleUpdatePost = async () => {
    if (handleActionBlocked('update post')) return;

    // Prevent multiple submissions
    if (isSubmitting || isPending) return;

    // Set submitting state immediately to prevent multiple clicks
    setIsSubmitting(true);

    const images: MediaItem[] = [];
    const videos: MediaItem[] = [];
    const userId = article?.author_id?._id;

    if (!userId) {
      toast.error('User ID not found');
      setIsSubmitting(false);
      return;
    }

    for (const image of postImages) {
      try {
        const url = await uploadPostImage(userId, image);
        images.push({ url, type: MediaType.Image });
      } catch (error) {
        toast.error('Failed to upload image');
        setIsSubmitting(false);
        return;
      }
    }

    for (const video of postVideos) {
      try {
        const url = await uploadPostVideo(userId, video);
        videos.push({ url, type: MediaType.Video });
      } catch (error) {
        toast.error('Failed to upload video');
        setIsSubmitting(false);
        return;
      }
    }

    const updatedMedia = [...existingMedia, ...images, ...videos];

   
    const updatedPostData = {
      articleId,
      article: {
        _id: articleId,
        content: postContent,
        media: updatedMedia,
        type: 'ShortForm',
        status: 'Published',
        isArticle: false,
        isCommunique: isCommunique,
        tags: tags,
      } as Article, 
    };

    updateArticle(updatedPostData, {
      onSuccess: () => {
        toast.success('Post updated successfully');
        setIsSubmitting(false);
        setIsModalOpen(false);
      },
      onError: (error: any) => {
        toast.error('Error updating post: ' + (error?.response?.data?.message || error?.message));
        setIsSubmitting(false);
      },
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleActionBlocked('edit post')) return;
    setPostContent(e.target.value);
  };

  const handleEmojiClick = () => setIsEmojiPickerOpen((v) => !v);

  const handleSaveTags = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleRemoveMedia = (type: 'image' | 'video', index: number, isExisting: boolean) => {
    if (handleActionBlocked('remove media')) return;
    if (isExisting) {
      const updatedExistingMedia = existingMedia.filter((_, i) => i !== index);
      setExistingMedia(updatedExistingMedia);
    } else if (type === 'image') {
      const updatedImages = postImages.filter((_, i) => i !== index);
      setPostImages(updatedImages);
    } else {
      const updatedVideos = postVideos.filter((_, i) => i !== index);
      setPostVideos(updatedVideos);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      as="div"
      className="relative z-[9990] focus:outline-none"
      onClose={() => {
        if (!showTagsModal) {
          setIsModalOpen(false);
        }
      }}
    >
      <DialogBackdrop className="fixed inset-0 z-[9990] bg-black/20" />

      <div className="fixed inset-0 z-[9990] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            className={cn(
              'w-full max-w-[95vw] sm:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-xl bg-background p-4 sm:p-6 backdrop-blur-2xl duration-300 ease-out',
              isModalOpen ? 'opacity-100' : 'opacity-0',
              showTagsModal ? 'pointer-events-none opacity-50' : ''
            )}
          >
            {/* Title */}
            <DialogTitle
              as="h3"
              className="text-lg font-semibold mb-4 flex items-center justify-center relative"
            >
              <span className="w-full text-center block">{t('Edit Post')}</span>
              <X
                size={32}
                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer bg-neutral-800 rounded-full p-2 shadow hover:bg-neutral-700"
                style={{ marginRight: '0.25rem' }}
                onClick={() => {
                  if (!showTagsModal) {
                    setIsModalOpen(false);
                  }
                }}
                strokeWidth={2.5}
              />
            </DialogTitle>

            {/* User Preview */}
            {isLoggedIn && authUser && (
              <div
                className="flex items-center mb-2 justify-between w-[95%] max-w-[600px] mx-auto mb-2"
                style={{ marginTop: '0.5rem' }}
              >
                <div className="flex items-center gap-3">
                  {authUser.profile_picture ? (
                    <img
                      src={authUser.profile_picture}
                      alt={authUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                      {authUser?.name
                        ? authUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase(): ""}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">{authUser.name}</span>
                    {authUser.bio && (
                      <span
                        className="text-neutral-200 text-sm truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
                        title={authUser.bio}
                      >
                        {authUser.bio.length > 30 ? `${authUser.bio.substring(0, 30)}...` : authUser.bio}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative group">
                  <MoreVertical
                    size={18}
                    className="text-neutral-300 cursor-pointer"
                    onClick={() => setShowMenu((v) => !v)}
                  />
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-neutral-600 rounded-lg shadow-lg p-3 z-50">
                      <button
                        className="w-full text-left p-2 hover:bg-neutral-700 rounded flex items-center gap-2 text-sm transition-colors"
                        onClick={() => {
                          setIsCommunique(!isCommunique);
                          setShowMenu(false);
                        }}
                      >
                        <Star size={16} className={isCommunique ? "text-secondary-400 fill-secondary-400" : "text-neutral-400"} />
                        {isCommunique ? 'Undo Communiquer' : 'Set as Communiquer'}
                      </button>
                      
                      <div className="border-t border-neutral-600 my-2"></div>
                      
                      <button
                        className="w-full text-left p-2 hover:bg-neutral-700 rounded flex items-center gap-2 text-sm transition-colors"
                        onClick={() => {
                          setShowTagsModal(true);
                          setShowMenu(false);
                        }}
                      >
                        <LuTag size={16} className="text-primary-400" />
                        Add Tags {tags.length > 0 && `(${tags.length})`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isFetching ? (
              <div className="flex justify-center items-center h-80">
                <LuLoader className="animate-spin size-8" />
              </div>
            ) : (
              <div className="h-[100%] flex-grow">
                {/* Text area */}
                <div className="flex flex-col items-center mb-6 relative">
                  <div
                    className="rounded-lg  relative overflow-hidden"
                    style={{
                      width: '95%',
                      height: '344px',
                      minHeight: '200px',
                      borderRadius: '16px',
                      maxWidth: '600px',
                    }}
                  >
                    {/* Borders */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', borderRadius: '16px 16px 0 0', background: 'repeating-linear-gradient(to right, #cccccc 0 30px, transparent 30px 60px)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px', borderRadius: '0 0 16px 16px', background: 'repeating-linear-gradient(to right, #cccccc 0 30px, transparent 30px 60px)' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '100%', borderRadius: '16px 0 0 16px', background: 'repeating-linear-gradient(to bottom, #cccccc 0 30px, transparent 30px 60px)' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', borderRadius: '0 16px 16px 0', background: 'repeating-linear-gradient(to bottom, #cccccc 0 30px, transparent 30px 60px)' }} />

                    {/* Highlighted content */}
                    <div
                      ref={highlightRef}
                      aria-hidden
                      className="absolute inset-0 p-3 overflow-y-auto whitespace-pre-wrap break-words text-left text-base leading-relaxed pointer-events-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                      dangerouslySetInnerHTML={{
                        __html:
                          postContent.length > 0
                            ? buildHighlightedHtml(postContent)
                            : !isFocused
                            ? `<span class="text-neutral-500">${escapeHtml(isLoggedIn ? "Edit your post..." : "Sign in to edit")}</span>`
                            : '',
                      }}
                    />

                    <textarea
                      ref={textareaRef}
                      value={postContent}
                      onChange={handleTextChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onPaste={(e) => {
                        // Handle paste events properly on mobile
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        if (pastedText) {
                          setPostContent(prev => prev + pastedText);
                        }
                      }}
                      onInput={(e) => {
                        // Additional input handler for mobile compatibility
                        const target = e.target as HTMLTextAreaElement;
                        if (target.value !== postContent) {
                          setPostContent(target.value);
                        }
                      }}
                      className={cn(
                        'absolute inset-0 w-full h-full resize-none bg-transparent p-3 text-base leading-relaxed outline-none z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300',
                        !isLoggedIn ? 'cursor-not-allowed' : '',
                        'text-transparent caret-neutral-50'
                      )}
                      placeholder={''}
                      disabled={!isLoggedIn}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                </div>
                {/* Media Preview */}
                {(existingMedia.length > 0 || postImages.length > 0 || postVideos.length > 0) && (
                  <div className="flex justify-start items-center overflow-x-auto gap-2 my-2 py-2 border-b border-t border-neutral-400">
                    {existingMedia.map((media, index) => (
                      <div key={media.url} className="relative block h-28 w-28 flex-shrink-0">
                        {media.type === MediaType.Image ? (
                          <img src={media.url} alt="existing post image" className="object-cover h-full w-auto rounded" />
                        ) : (
                          <video src={media.url} className="object-cover w-auto h-full rounded" />
                        )}
                        <div
                          className="absolute top-0 right-0 bg-gray-400 rounded-full p-1 flex items-center justify-center cursor-pointer"
                          style={{ width: 24, height: 24 }}
                          onClick={() => handleRemoveMedia(media.type === MediaType.Image ? 'image' : 'video', index, true)}
                        >
                          <X size={16} strokeWidth={2} className="text-white" />
                        </div>
                      </div>
                    ))}
                    {postImages.map((image, index) => (
                      <div key={image.name} className="relative block h-28 w-28 flex-shrink-0">
                        <img src={URL.createObjectURL(image)} alt="new post image" className="object-cover h-full w-auto rounded" />
                        <div
                          className="absolute top-0 right-0 bg-gray-400 rounded-full p-1 flex items-center justify-center cursor-pointer"
                          style={{ width: 24, height: 24 }}
                          onClick={() => handleRemoveMedia('image', index, false)}
                        >
                          <X size={16} strokeWidth={2} className="text-white" />
                        </div>
                      </div>
                    ))}
                    {postVideos.map((video, index) => (
                      <div key={video.name} className="relative w-28 h-28 flex-shrink-0">
                        <video src={URL.createObjectURL(video)} className="object-cover w-auto h-full rounded" />
                        <div
                          className="absolute top-0 right-0 bg-gray-400 rounded-full p-1 flex items-center justify-center cursor-pointer"
                          style={{ width: 24, height: 24 }}
                          onClick={() => handleRemoveMedia('video', index, false)}
                        >
                          <X size={16} strokeWidth={2} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Emoji / Media / Character Count */}
                <div className="w-[95%] max-w-[600px] mx-auto mt-6 flex justify-between items-center">
                  <div className="flex items-center gap-4 md:gap-8">
                    {/* Communique indicator */}
                    {isCommunique && (
                      <div className="flex items-center justify-center relative group">
                        <Star 
                          size={20} 
                          className="text-secondary-400 fill-secondary-400" 
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background text-neutral-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                          This post is now a communique
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-50"></div>
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <button
                        className="flex items-center justify-center text-neutral-300 hover:text-neutral-50"
                        title="Add Emoji"
                        onClick={() => {
                          if (handleActionBlocked('add an emoji')) return;
                          handleEmojiClick();
                        }}
                      >
                        <img src={smile} alt="Add Emoji" className="w-5 h-5" />
                      </button>
                      {isEmojiPickerOpen && isLoggedIn && (
                        <div className="absolute z-50 top-full mt-2">
                          <Picker
                            searchPlaceHolder={t('Search Emojis')}
                            theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                            onEmojiClick={(emojiData) => {
                              setPostContent((prev) => prev + emojiData.emoji);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <label className="text-neutral-300 hover:text-neutral-50 cursor-pointer" title="Add Image">
                      <img src={image} alt="Add Image" className="w-6 h-6" />
                      <input type="file" accept="image/*" className="hidden" multiple onChange={onPickImage} />
                    </label>

                    <label className="text-neutral-300 hover:text-neutral-50 cursor-pointer" title="Add Video">
                      <img src={video} alt="Add Video" className="w-5 h-5" />
                      <input type="file" accept="video/*" className="hidden" multiple onChange={onPickVideo} />
                    </label>
                  </div>

                  <span className="text-sm font-medium">
                    <span className={cn(postContent.length <= SHORT_POST_LENGTH ? 'text-primary-400' : 'text-red-500')}>
                      {postContent.length}
                    </span>
                    <span className="text-plain-a">/{SHORT_POST_LENGTH} characters</span>
                  </span>
                </div>

                {/* Update Button */}
                <div className="flex justify-center mt-4">
                  <button
                    className={cn(
                      'py-2 px-10 rounded-full font-semibold transition-all duration-300',
                      postContent.length === 0 || postContent.length > SHORT_POST_LENGTH || isSubmitting || isPending
                        ? 'border-2 border-neutral-400 text-neutral-300 cursor-not-allowed bg-neutral-600'
                        : postContent.length >= 1000
                        ? 'border-2 border-primary-400 bg-primary-400 text-white cursor-pointer'
                        : postContent.length > 0
                        ? 'border-2 border-primary-400 text-neutral-50 hover:bg-primary-400 hover:text-white cursor-pointer'
                        : 'border-2 border-neutral-400 text-neutral-300 cursor-not-allowed'
                    )}
                    onClick={handleUpdatePost}
                    disabled={postContent.length === 0 || postContent.length > SHORT_POST_LENGTH || isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? (
                      <>
                        <LuLoader className="animate-spin inline-block mr-2" />
                        <span className="block">{t('Updating')}...</span>
                      </>
                    ) : (
                      <>
                        <span className="block md:hidden">{t('Update')}</span>
                        <span className="hidden md:block">{t('Update Post')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>

      {showSignInPopup && (
        <SignInPopUp
          text={showSignInPopup}
          position="above"
          onClose={() => setShowSignInPopup(null)}
        />
      )}

      {/* Tags Modal */}
      <TagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        onSave={handleSaveTags}
        selectedTags={tags}
      />
    </Dialog>
  );
};

export default PostEditModal;