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
import { reeplsIcon } from '../../../assets/icons';
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';
import PostModal from '../../../feature/Blog/components/PostModal';
import { useCreateArticle } from '../../../feature/Blog/hooks/useArticleHook';
import { useUser } from '../../../hooks/useUser';
import { Article } from '../../../models/datamodels';
import { cn } from '../../../utils';
import { uploadPostImage, uploadPostVideo } from '../../../utils/media';
import SidebarItem from '../../atoms/SidebarItem';
import './sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useUser();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useCreateArticle();
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
      icon: LuSearch,
      name: 'Search',
      link: '/search',
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
      link: `/profile/${authUser?.username}`,
    },
  ];

  const handlePost = async (postContent: string, postImages: File[], postVideos: File[]) => {
    const images: string[] = [];
    const videos: string[] = [];
    for (const image of postImages) {
      if (authUser.id) {
        const result = await uploadPostImage(authUser?.id, image);
        images.push(result?.secure_url);
      }
    }
    for (const video of postVideos) {
      if (authUser.id) {
        const result = await uploadPostVideo(authUser?.id, video);
        videos.push(result?.secure_url);
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

  return (
    <div className="side">
      <LuCircleChevronRight
        className={cn(
          'size-6 p-0 rounded-full cursor-pointer',
          isOpen && 'rotate-180',
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
          <img src={reeplsIcon} alt="reeplsicon" className={`${isOpen ? 'size-8' : 'size-9'}`} />
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
    </div>
  );
};

export default Sidebar;
