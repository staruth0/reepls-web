import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import Picker, { Theme } from 'emoji-picker-react';

// import * as RadixPopover from '@radix-ui/react-popover';
import React, { useContext, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import {
  LuBell,
  LuBookmark,
  LuCalendar,
  LuCircleChevronLeft,
  LuCirclePlus,
  LuClock,
  LuHouse,
  LuImage,
  LuPencilLine,
  LuPlus,
  LuSearch,
  LuSmile,
  LuVideo,
  LuX,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import SidebarItem from '../../atoms/SidebarItem';

import { useTranslation } from 'react-i18next';
import { allowedImageTypes, allowedVideoTypes } from '../../../constants';
// import { AuthContext } from '../../../context/AuthContext/authContext';
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';
import useTheme from '../../../hooks/useTheme';
import { cn } from '../../../utils';
import './sidebar.scss';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  // const { isTablet } = useResponsiveLayout();
  const { isOpen, toggleSidebar } = useContext(SidebarContext);
  const handleToggleSidebar = () => {
    console.log('Toggle sidebar', isOpen);
    toggleSidebar();
  };

  const navLinks = [
    {
      icon: LuHouse,
      name: 'Feed',
      link: '/feed',
    },
    {
      icon: LuSearch, // or LuCompass
      name: 'Search', // or Explore
      link: '/explore',
    },
    {
      icon: LuBookmark,
      name: 'Bookmarks',
      link: '/bookmarks',
    },
    {
      icon: LuBell,
      name: 'Notifications',
      link: '/notifications',
      badgeContent: 14,
    },
    {
      icon: FaRegUserCircle,
      name: 'Profile',
      link: `/profile/`,
    },
  ];

  // fixed top-0 h-screen w-[65%] bg-white z-10

  return (
    <div className="side">
      <LuCircleChevronLeft
        className={cn(
          'size-6 p-0 rounded-full cursor-pointer',
          isSidebarCollapsed && 'rotate-180',
          'transition-all duration-300 ease-in-out',
          'hover:text-primary-400',
          'bg-background border-none absolute z-10 top-1/2 right-0 transform translate-x-1/2 text-neutral-400'
        )}
        onClick={() => handleToggleSidebar()}
      />
      <div className="flex gap-5 items-center h-[80px]">
        <div className=" text-roboto text-[24px] font-semibold">REEPLS</div>
      </div>

      <div className="sidebar__links">
        {navLinks.map((navItem, index) => (
          <SidebarItem
            key={index}
            NavItemIcon={navItem.icon}
            name={navItem.name}
            link={navItem.link}
            badgeContent={navItem.badgeContent}
            isSidebarcollapsed={!isSidebarCollapsed}
          />
        ))}
      </div>

      {isCreatingPost && <CreateRegularPostModal isModalOpen={isCreatingPost} setIsModalOpen={setIsCreatingPost} />}
      <div className="create__post__btn">
        <Popover className="relative">
          <PopoverButton
            className={cn(`create__post__button `, 'disabled:text-neutral-400 disabled:cursor-not-allowed')}
            disabled={isCreatingPost}>
            <LuCirclePlus className="create__post__icon" style={{ width: '20px', height: '20px' }} />
            {!isSidebarCollapsed && t(`Create Post`)}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className={cn('PopoverContent flex flex-col bg-red-500 z-50 mt-2', isSidebarCollapsed ? 'w-32' : 'w-40')}>
            <div className="block text-center">
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => setIsCreatingPost(true)}>
                <LuPlus className="size-4" />
                <span className="text-sm">{isSidebarCollapsed ? t(`Post`) : t(`Create Post`)}</span>
              </button>
              <hr className="border-neutral-400 w-3/4 mx-auto" />
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4  hover:text-primary-400"
                onClick={() => navigate('/posts/create')}>
                <LuPencilLine className="size-4" />
                <span className="text-sm">{isSidebarCollapsed ? t(`Write`) : t(`Write Article`)}</span>
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
      {/* <div className="create__post__btn">
        <RadixPopover.Root>
          <RadixPopover.Trigger asChild>
            <button
              className={cn(`create__post__button `, 'disabled:text-neutral-400 disabled:cursor-not-allowed')}
              disabled={isCreatingPost}>
              <LuCirclePlus className="size-5" />
              {!isSidebarCollapsed && t(`Create Post`)}
            </button>
          </RadixPopover.Trigger>
          <RadixPopover.Portal>
            <RadixPopover.Content
              className={cn('PopoverContent rounded-full', isSidebarCollapsed ? 'w-32' : 'w-44')}
              sideOffset={5}>
              <div className="block text-center">
                <button
                  className="flex items-center justify-center gap-2 cursor-pointer py-4 px-4 hover:text-primary-400"
                  onClick={() => setIsCreatingPost(true)}>
                  <LuPlus className="size-4" />
                  <span className="text-sm">{isSidebarCollapsed ? t(`Post`) : t(`Create Post`)}</span>
                </button>
                <hr className="border-neutral-400 w-3/4 mx-auto" />
                <button
                  className="flex items-center justify-center gap-2 cursor-pointer py-4 px-4  hover:text-primary-400"
                  onClick={() => navigate('/posts/create')}>
                  <LuPencilLine className="size-4" />
                  <span className="text-sm">{isSidebarCollapsed ? t(`Write`) : t(`Write Article`)}</span>
                </button>
              </div>
              <RadixPopover.Arrow className="PopoverArrow" />
            </RadixPopover.Content>
          </RadixPopover.Portal>
        </RadixPopover.Root>
      </div> */}
    </div>
  );
};

const CreateRegularPostModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const [postContent, setPostContent] = useState<string>('');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [postVideos, setPostVideos] = useState<File[]>([]);
  // const [postEvents, setPostEvents] = useState<File[]>([]);
  // const [postOther, setPostOther] = useState<File[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    let newImages = [];
    for (const file of files) {
      if (allowedImageTypes.includes(file.type)) {
        newImages.push(file);
      }
    }
    setPostImages([...postImages, ...newImages]);
  };

  const onPickVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('picking video', files);
    if (!files) return;
    let newVideos = [];
    console.log('picking ');
    for (const file of files) {
      console.log('file', file.type);
      if (allowedVideoTypes.includes(file.type)) {
        newVideos.push(file);
      }
    }
    setPostVideos([...postVideos, ...newVideos]);
    console.log('picked video', newVideos);
  };

  return (
    <Dialog
      open={isModalOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => setIsModalOpen(false)}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              'w-full h-full  md:max-w-xl lg:max-w-2xl xl:max-w-3xl  rounded-xl bg-background p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0',
              isModalOpen ? 'opacity-100' : 'opacity-0'
            )}>
            <DialogTitle as="h3" className="text-base/7 font-medium mb-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Post to anyone</div>
                <button onClick={() => setIsModalOpen(false)}>
                  <LuX className="size-6" />
                </button>
              </div>
            </DialogTitle>
            <div className=" h-[100%] flex-grow">
              <textarea
                className="w-full p-2 mb-4 border-none outline-none h-80 bg-background"
                autoFocus
                placeholder="What's on your mind?"
                rows={15}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              {(postImages.length > 0 || postVideos.length > 0) && (
                <div className="display-media flex justify-start items-center overflow-x-auto gap-2 my-1 py-1 px-4 border-b border-t border-neutral-400">
                  {postImages.map((image, index) => (
                    <div key={image.name} className="relative block h-32 w-32 aspect-w-1 aspect-h-1 flex-shrink-0">
                      <img src={URL.createObjectURL(image)} alt="post image" className="object-cover h-full w-auto" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => {
                          const updatedImages = postImages.filter((_, i) => i !== index);
                          setPostImages(updatedImages);
                        }}>
                        <LuX className="size-3" />
                      </button>
                    </div>
                  ))}
                  {postVideos.map((video, index) => (
                    <div key={video.name} className="relative w-32 h-32 flex-shrink-0">
                      <video src={URL.createObjectURL(video)} className="object-cover w-auto h-full" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => {
                          const updatedVideos = postVideos.filter((_, i) => i !== index);
                          setPostVideos(updatedVideos);
                        }}>
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
                      isEmojiPickerOpen && 'text-primary-400'
                    )}
                    title="Add Emoji"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
                    <LuSmile className="size-6" />
                  </button>
                  {isEmojiPickerOpen && (
                    <Picker
                      // className="sticky top-0 left-0"
                      searchPlaceHolder={t('Search Emojis')}
                      theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                      style={{ position: 'absolute', top: '100%', left: '0' }}
                      onEmojiClick={(emojiData) => {
                        // console.log('emojiData', emojiData);
                        setPostContent(postContent + emojiData.emoji);
                      }}
                    />
                  )}
                </div>

                <div className="additional__actions flex gap-4">
                  <label className="hover:text-primary-400 cursor-pointer" title="Add Image">
                    <LuImage className="size-6" />
                    <input type="file" accept="image/*" className="hidden" multiple onChange={onPickImage} />
                  </label>
                  <label className="hover:text-primary-400 cursor-pointer" title="Add Video">
                    <LuVideo className="size-6" />
                    <input type="file" accept="video/*" className="hidden" multiple onChange={onPickVideo} />
                  </label>
                  <button className="hover:text-primary-400 cursor-pointer" title="Add Event">
                    <LuCalendar className="size-6" />
                  </button>
                  <button className="hover:text-primary-400 cursor-pointer" title="Add Other ">
                    <LuPlus className="size-6" />
                  </button>
                </div>
                <div className="mt-4 flex justify-end items-center gap-2 w-full">
                  <Button className="flex items-center gap-2 hover:text-primary-400 cursor-pointer">
                    <LuClock className="size-6" />
                  </Button>

                  <Button
                    className={cn(
                      'inline-flex items-center gap-2 py-1.5 px-12 border-2  rounded-full text-sm/6 font-semibold  shadow-inner shadow-white/10 hover:bg-primary-400',
                      'border-primary-400 cursor-pointer',
                      'transition-all duration-300 ease-in-out'
                    )}
                    onClick={() => setIsModalOpen(false)}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Sidebar;
