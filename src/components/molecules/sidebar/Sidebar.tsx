import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegUserCircle } from 'react-icons/fa';
import {
  LuBell,
  LuBookmark,
  LuCircleChevronRight,
  LuCirclePlus,
  LuHouse,
  LuPencilLine,
  LuPlus,
  LuSearch,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MAX_IMAGE_COUNT, MAX_VIDEO_COUNT } from '../../../constants';
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';
import PostModal from '../../../feature/Blog/components/PostModal';
import { useCreateArticle } from '../../../feature/Blog/hooks/useArticleHook';
import { useUser } from '../../../hooks/useUser';
import { Article, MediaItem, MediaType } from '../../../models/datamodels';
import { cn } from '../../../utils';
import { uploadPostImage, uploadPostVideo } from '../../../utils/media';
import SidebarItem from '../../atoms/SidebarItem';
import './sidebar.scss';
import { useNotificationsValues } from '../../../feature/Notifications/hooks';
import { commuLeft } from '../../../assets/icons';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { authUser, isLoggedIn } = useUser();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useCreateArticle();
  const { isOpen, toggleSidebar } = useContext(SidebarContext);

  const {notifications} = useNotificationsValues();
  const unreadNotifications = notifications.filter(notif => !notif.is_read);
   const screenWidth = window.innerWidth;

  console.log('all Not',notifications)
  console.log('uread Not',unreadNotifications)
  const unreadCount = unreadNotifications.length;

  const handleToggleSidebar = () => {
    console.log('Toggle sidebar', isOpen);
    toggleSidebar();
  };

  const handleGotoCommuniquePage = ()=>{
    navigate('/posts/communiques')
  }

  const navLinks = [
    {
      icon: LuHouse,
      name: 'Feed',
      link: '/feed',
    },
    {
      icon: LuSearch,
      name: 'Search',
      link: '/search',
    },
    {
      icon: LuBookmark,
      name: 'Bookmarks',
      link: `${isLoggedIn ? '/bookmarks' : '/bookmarks/anonymous'}`,
    },
    {
      icon: LuBell,
      name: 'Notifications',
      link: `${isLoggedIn ? '/notifications' : '/notifications/anonymous'}`,
      badgeContent: unreadCount,
    },
    {
      icon: FaRegUserCircle,
      name: 'Profile',
      link: `${isLoggedIn ? `/profile/${authUser?.username}` : '/anonymous'}`,
    },
  ];

  const handlePost = async (postContent: string, postImages: File[], postVideos: File[]) => {
    if (!authUser?.id) {
      toast.error('You must be logged in to create a post');
      return;
    }
    if (postImages.length > MAX_IMAGE_COUNT) {
      toast.error('You must upload at most ' + MAX_IMAGE_COUNT + ' images');
      return;
    }
    if (postVideos.length > MAX_VIDEO_COUNT) {
      toast.error('You must upload at most ' + MAX_VIDEO_COUNT + ' videos');
      return;
    }

    const images: MediaItem[] = [];
    const videos: MediaItem[] = [];
    for (const image of postImages) {
      if (authUser.id) {
        try {
          const url = await uploadPostImage(authUser?.id, image);
          images.push({ url, type: MediaType.Image });
        } catch (error) {
          toast.error('Your images could not be uploaded. Please try again later.');
          return;
        }
      }
    }
    for (const video of postVideos) {
      if (authUser.id) {
        try {
          const url = await uploadPostVideo(authUser?.id, video);
          videos.push({ url, type: MediaType.Video });
        } catch (error) {
          toast.error('Your videos could not be uploaded. Please try again later.');
          return;
        }
      }
    }

    const post: Article = {
      content: postContent,
      media: [...images, ...videos],
      type: 'ShortForm',
      status: 'Published',
      isArticle: false,
    };

    createPost(post, {
      onSuccess: () => {
        setIsCreatingPost(false);
        navigate('/feed');
      },
      onError: (error: any) => {
        toast.error('Error creating post: ' + error?.response?.data?.message || error?.message);
      },
    });
  };

  const isTabletSmall = screenWidth >= 640 && screenWidth < 930;

  return (
    <div className="side bg-background">
      <LuCircleChevronRight
        className={cn(
          'size-7 md:size-6 p-0 rounded-full cursor-pointer',
          isOpen && 'rotate-180',
          isTabletSmall && 'hidden',
          'transition-all duration-300 ease-in-out',
          'hover:text-primary-400',
          'bg-background border-none absolute z-10 top-1/2 right-0 transform translate-x-1/2 text-neutral-400'
        )}
        onClick={() => handleToggleSidebar()}
      />
      <div className="flex gap-5 items-center h-[80px]">
        <div
          className="text-roboto text-[24px] font-semibold flex gap-2 items-center cursor-pointer"
          onClick={() => navigate('/feed')}>
          <img src={`/Logo.svg`} alt="reeplsicon" className={`${isOpen ? 'size-8' : 'size-9'}`} />
          {isOpen && 'REEPLS'}
        </div>
      </div>

      <div className="sidebar__links">
        {navLinks.map((navItem, index) => (
          <SidebarItem
            key={index}
            NavItemIcon={navItem.icon}
            name={navItem.name}
            link={navItem.link}
            badgeContent={navItem.badgeContent}
            isSidebarcollapsed={isOpen}
          />
        ))}
      </div>

      {isCreatingPost && (
        <PostModal
          isModalOpen={isCreatingPost}
          setIsModalOpen={setIsCreatingPost}
          handlePost={handlePost}
          isPending={isPending}
        />
      )}

      <div className="create__post__btn">
        <Popover className="relative">
          <PopoverButton
            className={cn(
              'create__post__button py-4',
              'disabled:text-neutral-400 disabled:cursor-not-allowed',
              isOpen ? 'px-6' : 'px-4'
            )}
            disabled={isCreatingPost}>
            <LuCirclePlus className="create__post__icon" />
            {isOpen && t('Create Post')}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className={cn('PopoverContent flex flex-col z-50 mt-2', isOpen ? 'w-40' : 'w-28')}>
            <div className="block text-center z-[999]">
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => setIsCreatingPost(true)}>
                <LuPlus className="size-4" />
                <span className="text-sm">{!isOpen ? t('Post') : t('Create Post')}</span>
              </button>
              <hr className="border-neutral-400 w-3/4 mx-auto" />
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => navigate('/posts/create')}>
                <LuPencilLine className="size-4" />
                <span className="text-sm">{!isOpen ? t('Write') : t('Write Article')}</span>
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      </div>

      <div className='md:hidden' onClick={handleGotoCommuniquePage}>
      <div className="p-4 ">
      <div className='flex gap-2'>
        <img src={commuLeft} alt="star" />
        {/* <LuStar className="size-6 bg-main-yellow rounded-full p-1" strokeWidth={2.5} /> */}
      {isOpen &&  <div className='line-clamp-1'>{t(`Communiques`)}</div>}
      </div>
    </div>
      </div>
      
    </div>
  );
};

export default Sidebar;
