import * as Popover from '@radix-ui/react-popover';
import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { LuBell, LuBookmark, LuHome, LuPlusCircle, LuSearch } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../../atoms/SidebarItem';

import './sidebar.scss';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);

  const navLinks = [
    {
      icon: LuHome,
      name: 'Home',
      link: '/feed',
    },
    {
      icon: LuSearch,
      name: 'Explore',
      link: '/feed/search',
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
    },
    {
      icon: FaRegUserCircle,
      name: 'Profile',
      link: '/profile',
    },
  ];

  return (
    <div className="side">
      <div className="logo__position">REEPLS</div>
      <div className="sidebar__links">
        {navLinks.map((navItem, index) => (
          <SidebarItem key={index} NavItemIcon={navItem.icon} name={navItem.name} link={navItem.link} />
        ))}
      </div>

      {isCreatingPost && <CreateRegularPostModal isModalOpen={isCreatingPost} setIsModalOpen={setIsCreatingPost} />}
      <div className="create__post__btn">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={`create__post__button `}
              disabled={location.pathname === '/posts/create' || isCreatingPost}>
              <LuPlusCircle className="create__post__icon" style={{ width: '20px', height: '20px' }} />
              Create Post
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="PopoverContent rounded-full" sideOffset={5}>
              <div className="block text-center">
                <button
                  className="cursor-pointer py-2 px-4 text-sm hover:text-primary-400"
                  onClick={() => setIsCreatingPost(true)}>
                  Create Regular Post
                </button>
                <hr className="border-neutral-400 w-3/4 mx-auto" />
                <button
                  className="cursor-pointer py-2 px-4 text-sm hover:text-primary-400"
                  onClick={() => navigate('/posts/create')}>
                  Write Article
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
