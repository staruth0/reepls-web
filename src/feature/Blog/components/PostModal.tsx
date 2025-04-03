import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Picker, { Theme } from 'emoji-picker-react';
import React, { useState } from 'react';
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
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp'; // Assuming this is the correct path

const PostModal = ({
  isModalOpen,
  setIsModalOpen,
  handlePost,
  isPending,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  handlePost: (postContent: string, postImages: File[], postVideos: File[]) => void;
  isPending: boolean;
}) => {
  const [postContent, setPostContent] = useState<string>('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null); // Store action type for popup
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();

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
      if (file && file.size > MAX_VIDEO_SIZE) {
        toast.error('Video size must be less than ' + MAX_VIDEO_SIZE / 1024 / 1024 + ' MB');
        return;
      }
    }
    setPostVideos([...postVideos, ...newVideos]);
  };

  const handlePostClick = () => {
    if (handleActionBlocked('post')) return;
    handlePost(postContent, postImages, postVideos);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleActionBlocked('write a post')) return;
    if (e.target.value.length <= SHORT_POST_LENGTH) {
      setPostContent(e.target.value);
    }
  };

  const handleEmojiClick = () => {
    if (handleActionBlocked('add an emoji')) return;
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleRemoveMedia = (type: 'image' | 'video', index: number) => {
    if (handleActionBlocked('remove media')) return;
    if (type === 'image') {
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
      className="relative z-[999] focus:outline-none"
      onClose={() => setIsModalOpen(false)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              'w-full h-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-xl bg-background p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0',
              isModalOpen ? 'opacity-100' : 'opacity-0'
            )}
          >
            <DialogTitle as="h3" className="text-base/7 font-medium mb-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Post to anyone</div>
                <button onClick={() => setIsModalOpen(false)}>
                  <LuX className="size-6" />
                </button>
              </div>
            </DialogTitle>

            <div className="h-[100%] flex-grow">
              <textarea
                className={cn(
                  'w-full resize-none p-2 mb-4 border-none outline-none h-80 bg-background',
                  !isLoggedIn && 'cursor-not-allowed text-neutral-500'
                )}
                autoFocus
                placeholder={isLoggedIn ? "What's on your mind?" : "Sign in to post"}
                rows={15}
                value={postContent}
                onChange={handleTextChange}
                disabled={!isLoggedIn} // Disable textarea when not logged in
              />
              {(postImages.length > 0 || postVideos.length > 0) && (
                <div className="display-media flex justify-start items-center overflow-x-auto gap-2 my-1 py-1 px-4 border-b border-t border-neutral-400">
                  {postImages.map((image, index) => (
                    <div key={image.name} className="relative block h-32 w-32 aspect-w-1 aspect-h-1 flex-shrink-0">
                      <img src={URL.createObjectURL(image)} alt="post image" className="object-cover h-full w-auto" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => handleRemoveMedia('image', index)}
                      >
                        <LuX className="size-3" />
                      </button>
                    </div>
                  ))}
                  {postVideos.map((video, index) => (
                    <div key={video.name} className="relative w-32 h-32 flex-shrink-0">
                      <video src={URL.createObjectURL(video)} className="object-cover w-auto h-full" />
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

              <div className="actions flex flex-col justify-between items-start gap-3">
                <div className="relative">
                  <button
                    className={cn(
                      'flex items-center justify-center border-none outline-none hover:text-primary-400 cursor-pointer',
                      isEmojiPickerOpen && 'text-primary-400',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    title="Add Emoji"
                    onClick={handleEmojiClick}
                    disabled={!isLoggedIn}
                  >
                    <LuSmile className="size-6" />
                  </button>
                  {isEmojiPickerOpen && isLoggedIn && (
                    <Picker
                      searchPlaceHolder={t('Search Emojis')}
                      theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                      style={{ position: 'absolute', top: '100%', left: '0' }}
                      onEmojiClick={(emojiData) => {
                        if (postContent.length <= SHORT_POST_LENGTH) {
                          setPostContent(postContent + emojiData.emoji);
                        }
                      }}
                    />
                  )}
                </div>

                <div className="additional__actions flex gap-4">
                  <label
                    className={cn(
                      'hover:text-primary-400 cursor-pointer',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    title="Add Image"
                  >
                    <LuImage className="size-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={onPickImage}
                      disabled={!isLoggedIn}
                    />
                  </label>
                  <label
                    className={cn(
                      'hover:text-primary-400 cursor-pointer',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    title="Add Video"
                  >
                    <LuVideo className="size-6" />
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      multiple
                      onChange={onPickVideo}
                      disabled={!isLoggedIn}
                    />
                  </label>
                  <button
                    className={cn(
                      'hover:text-primary-400 cursor-pointer',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    title="Add Event"
                    onClick={() => handleActionBlocked('add an event')}
                    disabled={!isLoggedIn}
                  >
                    <LuCalendar className="size-6" />
                  </button>
                  <button
                    className={cn(
                      'hover:text-primary-400 cursor-pointer',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    title="Add Other"
                    onClick={() => handleActionBlocked('add other content')}
                    disabled={!isLoggedIn}
                  >
                    <LuPlus className="size-6" />
                  </button>
                </div>
                <div className="mt-4 flex justify-end items-center gap-2 w-full">
                  <span className="mr-3">
                    <span className={cn('text-primary-400', postContent.length > SHORT_POST_LENGTH && 'text-red-500')}>
                      {postContent.length}
                    </span>
                    /{SHORT_POST_LENGTH}
                  </span>
                  <Button
                    className={cn(
                      'flex items-center gap-2 hover:text-primary-400 cursor-pointer',
                      !isLoggedIn && 'text-neutral-500 cursor-not-allowed hover:text-neutral-500'
                    )}
                    onClick={() => handleActionBlocked('schedule a post')}
                    disabled={!isLoggedIn}
                  >
                    <LuCalendar className="size-6" />
                  </Button>
                  <Button
                    className={cn(
                      'inline-flex items-center gap-2 py-1.5 px-12 border-2 rounded-full text-sm/6 font-semibold shadow-inner shadow-white/10',
                      isLoggedIn
                        ? 'border-primary-400 hover:bg-primary-400 hover:text-background cursor-pointer'
                        : 'border-neutral-500 text-neutral-500 cursor-not-allowed',
                      'transition-all duration-300 ease-in-out'
                    )}
                    onClick={handlePostClick}
                    disabled={isPending || !isLoggedIn}
                  >
                    {isPending && <LuLoader className="animate-spin size-4 inline-block mx-2" />}
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>

      {/* SignIn Popup */}
      {showSignInPopup && (
        <SignInPopUp
          text={showSignInPopup}
          position="above"
          onClose={() => setShowSignInPopup(null)}
        />
      )}
    </Dialog>
  );
};

export default PostModal;