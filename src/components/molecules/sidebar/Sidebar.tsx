import * as Popover from '@radix-ui/react-popover';
import React, { useContext, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { LuBell, LuBookmark, LuCircleArrowLeft, LuCirclePlus, LuHouse, LuSearch } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../../atoms/SidebarItem';

import { useTranslation } from 'react-i18next';
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';
import { useResponsiveLayout } from '../../../hooks/useResposiveLayout';
import { cn } from '../../../utils';
import './sidebar.scss';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isTablet } = useResponsiveLayout();
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
      link: '/profile',
    },
  ];

  // fixed top-0 h-screen w-[65%] bg-white z-10

  return (
    <div className="side">
      <LuCircleArrowLeft
        className={cn(
          'size-6 p-0 rounded-full cursor-pointer',
          isSidebarCollapsed && 'rotate-180',
          'transition-all duration-300 ease-in-out',
          'flex items-center justify-center',
          'hover:text-primary-400',
          'bg-background border-none absolute top-1/2 right-0 transform translate-x-1/2'
        )}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={`create__post__button `}
              disabled={location.pathname === '/posts/create' || isCreatingPost}>
              <LuCirclePlus className="create__post__icon" style={{ width: '20px', height: '20px' }} />
              {!isSidebarCollapsed && t(`Create Post`)}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="PopoverContent rounded-full" sideOffset={5}>
              <div className="block text-center">
                <button
                  className="cursor-pointer py-2 px-4 text-sm hover:text-primary-400"
                  onClick={() => setIsCreatingPost(true)}>
                  {t(`Create Regular Post`)}
                </button>
                <hr className="border-neutral-400 w-3/4 mx-auto" />
                <button
                  className="cursor-pointer py-2 px-4 text-sm hover:text-primary-400"
                  onClick={() => navigate('/posts/create')}>
                  {t(`Write Article`)}
                </button>
              </div>
              <Popover.Arrow className="PopoverArrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
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
  return (
    <div className="dialog__modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000 min-h-screen min-w-screen">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4">Create a Post</h3>
        <textarea className="w-full h-32 p-2 border border-gray-300 rounded mb-4" placeholder="What's on your mind?" />
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Post</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
