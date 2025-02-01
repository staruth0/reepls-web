import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

// import * as RadixPopover from '@radix-ui/react-popover';
import React, { useContext, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import {
  LuBell,
  LuBookmark,
  LuCircleChevronLeft,
  LuCirclePlus,
  LuHouse,
  LuPencilLine,
  LuPlus,
  LuSearch,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import SidebarItem from "../../atoms/SidebarItem";

import { useTranslation } from "react-i18next";
// import { AuthContext } from '../../../context/AuthContext/authContext';
import { SidebarContext } from "../../../context/SidebarContext/SidebarContext";
import { cn } from "../../../utils";
import PostModal from "../../../feature/Blog/components/PostModal";
import "./sidebar.scss";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  // const { isTablet } = useResponsiveLayout();
  const { isOpen, toggleSidebar } = useContext(SidebarContext);
  const handleToggleSidebar = () => {
    console.log("Toggle sidebar", isOpen);
    toggleSidebar();
  };

  const navLinks = [
    {
      icon: LuHouse,
      name: "Feed",
      link: "/feed",
    },
    {
      icon: LuSearch, // or LuCompass
      name: "Search", // or Explore
      link: "/explore",
    },
    {
      icon: LuBookmark,
      name: "Bookmarks",
      link: "/bookmarks",
    },
    {
      icon: LuBell,
      name: "Notifications",
      link: "/notifications",
      badgeContent: 14,
    },
    {
      icon: FaRegUserCircle,
      name: "Profile",
      link: `/profile/`,
    },
  ];

  const handlePost = (
    postContent: string,
    postImages: File[],
    postVideos: File[]
  ) => {
    console.log("postContent", postContent);
    console.log("postImages", postImages);
    console.log("postVideos", postVideos);
  };

  // fixed top-0 h-screen w-[65%] bg-white z-10

  return (
    <div className="side">
      <LuCircleChevronLeft
        className={cn(
          "size-6 p-0 rounded-full cursor-pointer",
          isOpen && "rotate-180",
          "transition-all duration-300 ease-in-out",
          "hover:text-primary-400",
          "bg-background border-none absolute z-10 top-1/2 right-0 transform translate-x-1/2 text-neutral-400"
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
            isSidebarcollapsed={isOpen}
          />
        ))}
      </div>

      {isCreatingPost && (
        <PostModal
          isModalOpen={isCreatingPost}
          setIsModalOpen={setIsCreatingPost}
          handlePost={handlePost}
        />
      )}
      <div className="create__post__btn">
        <Popover className="relative">
          <PopoverButton
            className={cn(
              `create__post__button `,
              "disabled:text-neutral-400 disabled:cursor-not-allowed"
            )}
            disabled={isCreatingPost}
          >
            <LuCirclePlus
              className="create__post__icon"
              style={{ width: "20px", height: "20px" }}
            />
            {isOpen && t(`Create Post`)}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className={cn(
              "PopoverContent flex flex-col bg-red-500 z-50 mt-2",
              !isOpen ? "w-32" : "w-40"
            )}
          >
            <div className="block text-center">
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => setIsCreatingPost(true)}
              >
                <LuPlus className="size-4" />
                <span className="text-sm">
                  {!isOpen ? t(`Post`) : t(`Create Post`)}
                </span>
              </button>
              <hr className="border-neutral-400 w-3/4 mx-auto" />
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4  hover:text-primary-400"
                onClick={() => navigate("/posts/create")}
              >
                <LuPencilLine className="size-4" />
                <span className="text-sm">
                  {!isOpen ? t(`Write`) : t(`Write Article`)}
                </span>
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

export default Sidebar;
