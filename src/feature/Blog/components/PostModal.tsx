import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Picker, { Theme } from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuImage, LuLoader, LuPlus, LuSmile, LuVideo, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
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
    isCommunique: boolean
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

  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn, authUser } = useUser();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const hasContent = postContent.trim().length > 0;

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
  };

  const handlePostClick = () => {
    if (handleActionBlocked('post')) return;
    handlePost(postContent, postImages, postVideos, isCommunique);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleActionBlocked('write a post')) return;
    if (e.target.value.length <= SHORT_POST_LENGTH) {
      setPostContent(e.target.value);
    } else {
      setPostContent(e.target.value.slice(0, SHORT_POST_LENGTH));
    }
  };

  const handleEmojiClick = () => setIsEmojiPickerOpen((v) => !v);

  const handleRemoveMedia = (type: 'image' | 'video', index: number) => {
    if (handleActionBlocked('remove media')) return;
    if (type === 'image') {
      setPostImages((p) => p.filter((_, i) => i !== index));
    } else {
      setPostVideos((p) => p.filter((_, i) => i !== index));
    }
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

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
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener('scroll', onScroll);
    return () => ta.removeEventListener('scroll', onScroll);
  }, []);

  const highlightedHtml = postContent ? buildHighlightedHtml(postContent) : '';
  const placeholderText = isLoggedIn ? t("What's on your mind ?") : t('Sign in to post');

  return (
    <Dialog
      open={isModalOpen}
      as="div"
      className="relative z-[999] focus:outline-none"
      onClose={() => setIsModalOpen(false)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            className={cn(
              'w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-xl bg-background p-6 backdrop-blur-2xl duration-300 ease-out',
              isModalOpen ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* Title */}
            <DialogTitle as="h3" className="text-lg font-semibold mb-4 relative text-center">
              {t('Create a Post')}
              <button onClick={() => setIsModalOpen(false)} className="absolute top-0 right-0">
                <LuX className="size-6" />
              </button>
            </DialogTitle>

            {/* User Preview */}
            {isLoggedIn && authUser && (
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center gap-3">
                  {authUser.profilePicture ? (
                    <img
                      src={authUser.profilePicture}
                      alt={authUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                      {authUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-medium text-base">{authUser.name}</span>
                    <span className="text-green-500 text-xs">Shared with everyone</span>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex flex-col items-center justify-center gap-[2px] text-gray-400 hover:text-black">
                    <span className="block w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-current"></span>
                  </button>

                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg p-2 hidden group-hover:block z-50">
                    <button
                      className="w-full text-left p-1 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => handleActionBlocked('add an event')}
                    >
                      <LuCalendar className="size-5" />
                      {t('Add Event')}
                    </button>
                    <button
                      className="w-full text-left p-1 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => handleActionBlocked('add other content')}
                    >
                      <LuPlus className="size-5" />
                      {t('Other')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Text box */}
            <div className="flex flex-col items-center mb-2 relative">
              <div
                className="w-full border-2 border-dashed border-gray-400 rounded-lg bg-[#b8b7b7] relative"
                style={{ height: '344px', minHeight: '250px' }}
              >
                <div
                  ref={highlightRef}
                  aria-hidden
                  className="absolute inset-0 p-3 overflow-auto whitespace-pre-wrap break-words text-left text-base leading-relaxed pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      postContent.length > 0
                        ? highlightedHtml
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
                  onScroll={() => {
                    if (highlightRef.current && textareaRef.current) {
                      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
                      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
                    }
                  }}
                  className={cn(
                    'absolute inset-0 w-full h-full resize-none bg-transparent p-3 text-base leading-relaxed outline-none z-10',
                    !isLoggedIn ? 'cursor-not-allowed' : '',
                    'text-transparent caret-black'
                  )}
                  placeholder={''}
                  disabled={!isLoggedIn}
                />
              </div>
            </div>

            {/* Emoji / Media / Word Count */}
            <div className="flex justify-between items-center w-full mt-3 mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    className="flex items-center justify-center text-gray-400 hover:text-black"
                    title="Add Emoji"
                    onClick={() => {
                      if (handleActionBlocked('add an emoji')) return;
                      handleEmojiClick();
                    }}
                  >
                    <LuSmile className="size-6" />
                  </button>
                  {isEmojiPickerOpen && isLoggedIn && (
                    <div className="absolute z-50 top-full mt-2">
                      <Picker
                        searchPlaceHolder={t('Search Emojis')}
                        theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                        onEmojiClick={(emojiData) => {
                          setPostContent((prev) => {
                            const newText = prev + emojiData.emoji;
                            return newText.length <= SHORT_POST_LENGTH ? newText : prev;
                          });
                        }}
                      />
                    </div>
                  )}
                </div>

                <label className="text-gray-400 hover:text-black cursor-pointer" title="Add Image">
                  <LuImage className="size-7" />
                  <input type="file" accept="image/*" className="hidden" multiple onChange={onPickImage} />
                </label>

                <label className="text-gray-400 hover:text-black cursor-pointer" title="Add Video">
                  <LuVideo className="size-6" />
                  <input type="file" accept="video/*" className="hidden" multiple onChange={onPickVideo} />
                </label>
              </div>

              <span className="text-sm font-medium">
                <span className={cn(postContent.length <= SHORT_POST_LENGTH ? 'text-green-500' : 'text-red-500')}>
                  {postContent.length}
                </span>
                <span className="text-black">/{SHORT_POST_LENGTH}</span>
              </span>
            </div>

            {/* Media Preview */}
            {(postImages.length > 0 || postVideos.length > 0) && (
              <div className="flex justify-start items-center overflow-x-auto gap-2 my-2 py-2 border-b border-t border-neutral-400">
                {postImages.map((image, index) => (
                  <div key={image.name} className="relative block h-28 w-28 flex-shrink-0">
                    <img src={URL.createObjectURL(image)} alt="post image" className="object-cover h-full w-auto rounded" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveMedia('image', index)}
                    >
                      <LuX className="size-3" />
                    </button>
                  </div>
                ))}
                {postVideos.map((video, index) => (
                  <div key={video.name} className="relative w-28 h-28 flex-shrink-0">
                    <video src={URL.createObjectURL(video)} className="object-cover w-auto h-full rounded" />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveMedia('video', index)}
                    >
                      <LuX className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Publish / Post Button */}
            <div className="flex justify-center mt-4">
              <button
                className={cn(
                  'py-2 px-10 rounded-full font-semibold transition-all duration-300',
                  hasContent
                    ? 'border-2 border-green-500 text-black hover:bg-green-500 hover:text-white cursor-pointer'
                    : 'border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                )}
                onClick={handlePostClick}
                disabled={!hasContent}
              >
                {isPending ? (
                  <LuLoader className="animate-spin inline-block mr-2" />
                ) : (
                  <>
                    <span className="block md:hidden">{t('Post')}</span>
                    <span className="hidden md:block">{t('Publish')}</span>
                  </>
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>

      {showSignInPopup && (
        <SignInPopUp text={showSignInPopup} position="above" onClose={() => setShowSignInPopup(null)} />
      )}
    </Dialog>
  );
};

export default PostModal;
