import {  Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Picker, { Theme } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
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
} from '../../../constants';
import useTheme from '../../../hooks/useTheme';
import { cn } from '../../../utils';
import { useUser } from '../../../hooks/useUser';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import smile from '../../../assets/images/smile.png';
import image from '../../../assets/images/image-02.png';
import video from '../../../assets/images/video-02.png';

const CHAR_LIMIT = 2500; // Updated name

// localStorage keys for auto-save
const AUTOSAVE_KEYS = {
  POST_CONTENT: 'reepls_draft_post_content',
  POST_IMAGES: 'reepls_draft_post_images',
  POST_VIDEOS: 'reepls_draft_post_videos',
  POST_COMMUNIQUE: 'reepls_draft_post_communique',
  POST_TAGS: 'reepls_draft_post_tags',
  POST_TIMESTAMP: 'reepls_draft_post_timestamp'
};

// Helper functions for localStorage operations
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

const clearDraftFromLocalStorage = () => {
  try {
    Object.values(AUTOSAVE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

const PostModal = ({
  isModalOpen,
  setIsModalOpen,
  handlePost,
  isPending,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  handlePost: (
    postContent: string,
    postImages: File[],
    postVideos: File[],
    isCommunique: boolean,
    tags: string[]
  ) => void;
  isPending: boolean;
}) => {
  const [postContent, setPostContent] = useState<string>('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);
  const [isAutoSaved, setIsAutoSaved] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn, authUser } = useUser();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  const autoSaveDraft = () => {
    if (!isLoggedIn) return;
    
    saveToLocalStorage(AUTOSAVE_KEYS.POST_CONTENT, postContent);
    saveToLocalStorage(AUTOSAVE_KEYS.POST_COMMUNIQUE, isCommunique);
    saveToLocalStorage(AUTOSAVE_KEYS.POST_TAGS, tags);
    saveToLocalStorage(AUTOSAVE_KEYS.POST_TIMESTAMP, Date.now());

    setIsAutoSaved(true);
    setLastSavedTime(new Date().toLocaleTimeString());
    
    // Hide the auto-saved indicator after 3 seconds
    setTimeout(() => setIsAutoSaved(false), 3000);
  };

  const loadDraftFromStorage = () => {
    if (!isLoggedIn) return;

    const savedContent = loadFromLocalStorage(AUTOSAVE_KEYS.POST_CONTENT);
    const savedCommunique = loadFromLocalStorage(AUTOSAVE_KEYS.POST_COMMUNIQUE);
    const savedTags = loadFromLocalStorage(AUTOSAVE_KEYS.POST_TAGS);
    const savedTimestamp = loadFromLocalStorage(AUTOSAVE_KEYS.POST_TIMESTAMP);

    if (savedContent || savedCommunique || savedTags) {
      if (savedContent) setPostContent(savedContent);
      if (savedCommunique !== null) setIsCommunique(savedCommunique);
      if (savedTags) setTags(savedTags);
      
      if (savedTimestamp) {
        const savedDate = new Date(savedTimestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) { // Only restore if saved within 24 hours
          setLastSavedTime(savedDate.toLocaleTimeString());
        }
      }
    }
  };

  const scheduleAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSaveDraft();
    }, 2000); // Auto-save after 2 seconds of inactivity
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
      if (file && file.size > MAX_IMAGE_SIZE) {
        toast.error('Image size must be less than ' + MAX_IMAGE_SIZE / 1024 / 1024 + ' MB');
        return;
      }
    }
    setPostImages((p) => [...p, ...newImages]);
    scheduleAutoSave(); // Trigger auto-save when images are added
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
      if (file && file.size > MAX_VIDEO_SIZE) {
        toast.error('Video size must be less than ' + MAX_VIDEO_SIZE / 1024 / 1024 + ' MB');
        return;
      }
    }
    setPostVideos((p) => [...p, ...newVideos]);
    scheduleAutoSave(); // Trigger auto-save when videos are added
  };

  const handlePostClick = () => {
    if (handleActionBlocked('post')) return;
    
    // Prevent multiple submissions
    if (isSubmitting || isPending) return;
    
    // Set submitting state immediately to prevent multiple clicks
    setIsSubmitting(true);
    
    // Clear localStorage when post is published
    clearDraftFromLocalStorage();
    
    handlePost(postContent, postImages, postVideos, isCommunique, tags);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleActionBlocked('write a post')) return;
    setPostContent(e.target.value);
    scheduleAutoSave(); // Trigger auto-save
  };

  const handleEmojiClick = () => {
    setIsEmojiPickerOpen((v) => !v);
    scheduleAutoSave(); // Trigger auto-save when emoji picker opens
  };

  const handleRemoveMedia = (type: 'image' | 'video', index: number) => {
    if (handleActionBlocked('remove media')) return;
    if (type === 'image') {
      setPostImages((p) => p.filter((_, i) => i !== index));
    } else {
      setPostVideos((p) => p.filter((_, i) => i !== index));
    }
    scheduleAutoSave(); // Trigger auto-save when media is removed
  };

  const handleSaveTags = (newTags: string[]) => {
    setTags(newTags);
    scheduleAutoSave(); // Trigger auto-save when tags are saved
  };

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
  }, []);

  // Load draft when modal opens
  useEffect(() => {
    if (isModalOpen && isLoggedIn) {
      loadDraftFromStorage();
    }
  }, [isModalOpen, isLoggedIn]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

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

  // const highlightedHtml = postContent ? buildHighlightedHtml(postContent) : '';
  const placeholderText = isLoggedIn ? t("What's on your mind ?") : t('Sign in to post');

  // Character count logic
  const charCount = postContent.length;

  // Button logic
  const isButtonGreen = charCount >= 1000;
  // const isButtonDisabled = charCount === 0 || charCount > CHAR_LIMIT;
  const canPost = charCount > 0 && charCount <= CHAR_LIMIT;

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
              <span className="w-full text-center block">{t('Create a Post')}</span>
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
                  {authUser?.profile_picture ? (
                    <img
                      src={authUser.profile_picture}
                      alt={authUser?.name || 'User'}
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
                    <span className="font-semibold text-base">{authUser?.name || 'User'}</span>
                    {authUser?.bio && (
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
                          scheduleAutoSave(); // Trigger auto-save when communique status changes
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

            {/* Text area */}
            <div className="flex flex-col items-center mb-6 relative">
              <div
                className="rounded-lg relative overflow-hidden"
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
                        ? `<span class="text-neutral-500">${escapeHtml(placeholderText)}</span>`
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
                      scheduleAutoSave();
                    }
                  }}
                  onInput={(e) => {
                    // Additional input handler for mobile compatibility
                    const target = e.target as HTMLTextAreaElement;
                    if (target.value !== postContent) {
                      setPostContent(target.value);
                      scheduleAutoSave();
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

              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium">
                  <span className={cn(charCount <= CHAR_LIMIT ? 'text-primary-400' : 'text-red-500')}>
                    {charCount}
                  </span>
                  <span className="text-plain-a">/{CHAR_LIMIT} characters</span>
                </span>
                
                {/* Auto-save indicator */}
                {isAutoSaved && (
                  <span className="text-xs text-primary-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                    Auto-saved
                  </span>
                )}
                
                {lastSavedTime && !isAutoSaved && (
                  <span className="text-xs text-neutral-400">
                    Last saved: {lastSavedTime}
                  </span>
                )}
              </div>
            </div>

            {/* Media Preview */}
            {(postImages.length > 0 || postVideos.length > 0) && (
              <div className="flex justify-start items-center overflow-x-auto gap-2 my-2 py-2 border-b border-t border-neutral-400">
                {postImages.map((image, index) => (
                  <div key={image.name} className="relative block h-28 w-28 flex-shrink-0">
                    <img src={URL.createObjectURL(image)} alt="post image" className="object-cover h-full w-auto rounded" />
                    <div
                      className="absolute top-0 right-0 bg-gray-400 rounded-full p-1 flex items-center justify-center cursor-pointer"
                      style={{ width: 24, height: 24 }}
                      onClick={() => handleRemoveMedia('image', index)}
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
                      onClick={() => handleRemoveMedia('video', index)}
                    >
                      <X size={16} strokeWidth={2} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Publish / Post Button */}
            <div className="flex justify-center mt-4">
              <button
                className={cn(
                  'py-2 px-10 rounded-full font-semibold transition-all duration-300',
                  charCount === 0 || charCount > CHAR_LIMIT || isSubmitting || isPending
                    ? 'border-2 border-neutral-400 text-neutral-300 cursor-not-allowed bg-neutral-600'
                    : isButtonGreen
                    ? 'border-2 border-primary-400 bg-primary-400 text-white cursor-pointer'
                    : canPost
                    ? 'border-2 border-primary-400 text-neutral-50 hover:bg-primary-400 hover:text-white cursor-pointer'
                    : 'border-2 border-neutral-400 text-neutral-300 cursor-not-allowed'
                )}
                onClick={handlePostClick}
                disabled={charCount === 0 || charCount > CHAR_LIMIT || isSubmitting || isPending}
              >
                {isSubmitting || isPending ? (
                  <>
                    <LuLoader className="animate-spin inline-block mr-2" />
                    <span className="block">{t('Publishing')}...</span>
                  </>
                ) : (
                  <span className="block">{t('Publish')}</span>
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>

      {showSignInPopup && (
        <SignInPopUp text={showSignInPopup} position="above" onClose={() => setShowSignInPopup(null)} />
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

export default PostModal;
