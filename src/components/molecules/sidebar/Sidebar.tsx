import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegUserCircle } from "react-icons/fa";
import {
  LuBell,
  LuBookmark,
  LuCircleChevronRight,
  LuCirclePlus,
  LuHouse,
  LuPencilLine,
  LuPlus,
  LuSearch,
  LuMic, // Import the microphone icon
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MAX_IMAGE_COUNT, MAX_VIDEO_COUNT } from "../../../constants";
import { SidebarContext } from "../../../context/SidebarContext/SidebarContext";
import PostModal from "../../../feature/Blog/components/PostModal";

import { useUser } from "../../../hooks/useUser";
import { Article, MediaItem, MediaType } from "../../../models/datamodels";
import { cn } from "../../../utils";
import { uploadPostImage, uploadPostVideo } from "../../../utils/media";
import SidebarItem from "../../atoms/SidebarItem";
// import StarToggle from '../../../components/atoms/CommuniqueBtn';
import "./sidebar.scss";
import { useNotificationsValues } from "../../../feature/Notifications/hooks";
import { commuLeft, favicon } from "../../../assets/icons";
import { useSendNewArticleNotification } from "../../../feature/Notifications/hooks/useNotification";
import { getDecryptedUser } from "../../../feature/Auth/api/Encryption";
import useTheme from "../../../hooks/useTheme";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const authUser = getDecryptedUser();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  // const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useSendNewArticleNotification();
  const { isOpen, toggleSidebar } = useContext(SidebarContext);

  const { notifications } = useNotificationsValues();
  const unreadNotifications = notifications.filter((notif) => !notif.is_read);
  const screenWidth = window.innerWidth;
  const { theme } = useTheme();

  const unreadCount = unreadNotifications.length;
  console.log("unreadNotifications", unreadNotifications);

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const handleGotoCommuniquePage = () => {
    navigate("/posts/communiques");
    handleToggleSidebar();
  };

  const navLinks = [
    {
      icon: LuHouse,
      name: "Feed",
      link: "/feed",
    },
    {
      icon: LuSearch,
      name: "Search",
      link: "/search",
    },
    {
      icon: LuBookmark,
      name: "Bookmarks",
      link: `${isLoggedIn ? "/bookmarks" : "/bookmarks/anonymous"}`,
    },
    {
      icon: LuBell,
      name: "Notifications",
      link: `${isLoggedIn ? "/notifications" : "/notifications/anonymous"}`,
      badgeContent: unreadCount,
    },
    {
      icon: FaRegUserCircle,
      name: "Profile",
      link: `${isLoggedIn ? `/profile/${authUser?.username}` : "/anonymous"}`,
    },
  ];

  const handlePost = async (
    postContent: string,
    postImages: File[],
    postVideos: File[],
    isCommunique: boolean,
    tags: string[]
  ) => {
    if (!authUser?.id) {
      toast.error("You must be logged in to create a post");
      return;
    }
    if (postImages.length > MAX_IMAGE_COUNT) {
      toast.error("You must upload at most " + MAX_IMAGE_COUNT + " images");
      return;
    }
    if (postVideos.length > MAX_VIDEO_COUNT) {
      toast.error("You must upload at most " + MAX_VIDEO_COUNT + " videos");
      return;
    }

    const images: MediaItem[] = [];
    const videos: MediaItem[] = [];
    for (const image of postImages) {
      if (authUser?.id) {
        try {
          const url = await uploadPostImage(authUser.id, image);
          images.push({ url, type: MediaType.Image });
        } catch {
          toast.error(
            "Your images could not be uploaded. Please try again later."
          );
          return;
        }
      }
    }
    for (const video of postVideos) {
      if (authUser?.id) {
        try {
          const url = await uploadPostVideo(authUser.id, video);
          videos.push({ url, type: MediaType.Video });
        } catch {
          toast.error(
            "Your videos could not be uploaded. Please try again later."
          );
          return;
        }
      }
    }

    const post: Article = {
      content: postContent,
      media: [...images, ...videos],
      type: "ShortForm",
      status: "Published",
      isArticle: false,
      is_communiquer: isCommunique,
      tags: tags,
    };

    createPost(post, {
      onSuccess: (data) => {
        setIsCreatingPost(false);
      
        const articleData = data?.notification?.article || data?.article || data;
        
        // Navigate based on isArticle property
        if (articleData?.isArticle) {
          // Navigate to article view by slug
          if (articleData?.slug) {
            navigate(`/posts/article/slug/${articleData.slug}`);
          } else if (articleData?._id) {
            navigate(`/posts/article/slug/${articleData._id}`);
          } else {
            navigate("/feed");
          }
        } else {
          // Navigate to post view by ID
          if (articleData?._id) {
            navigate(`/posts/post/${articleData._id}`);
          } else {
            navigate("/feed");
          }
        }
      },
      onError: (error: unknown) => {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : 'Unknown error occurred';
        toast.error("Error creating post: " + errorMessage);
      },
    });
  };

  const isTabletSmall = screenWidth >= 640 && screenWidth < 930;



  return (
    <div className="side bg-background hidden md:block">
      <LuCircleChevronRight
        className={cn(
          "size-7 md:size-6 p-0 rounded-full cursor-pointer",
          isOpen && "rotate-180",
          isTabletSmall && "hidden",
          "transition-all duration-300 ease-in-out",
          "hover:text-primary-400",
          "bg-background border-none absolute z-10 top-1/2 right-0 transform translate-x-1/2 text-neutral-400"
        )}
        onClick={() => handleToggleSidebar()}
      />
      <div className="flex gap-5 items-center h-[80px]">
        <div
          className="flex gap-1 items-center h-[80px] px-4 cursor-pointer"
          onClick={() => {
            navigate("/feed");
            if (window.innerWidth < 768) {
              handleToggleSidebar();
            }
          }}
        >
          <img
            src={favicon}
            alt="favicon"
            className="object-contain h-full w-7"
          />
          {isOpen && (
            <span
              className={cn(
                "text-2xl font-semibold transition-colors duration-300",
                theme === "dark" ? "text-white" : "text-neutral-50"
              )}
            >
              Reepls
            </span>
          )}
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
            handleToggleSidebar={handleToggleSidebar}
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
              "create__post__button py-4",
              "disabled:text-neutral-400 disabled:cursor-not-allowed",
              isOpen ? "px-6" : "px-4"
            )}
            disabled={isCreatingPost}
          >
            <LuCirclePlus className="create__post__icon" />
            {isOpen && t("Create Post")}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className={cn(
              "PopoverContent bg-background flex flex-col z-[999] mt-2 ",
              isOpen ? "w-40" : "w-28"
            )}
          >
            {({ close }) => (
              <div className="block bg-background  text-center z-[999]">
                <button
                  className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.error(t("Please login to create a post"));
                      return;
                    }
                    setIsCreatingPost(true);
                    close();
                  }}
                >
                  <LuPlus className="size-4" />
                  <span className="text-sm">
                    {!isOpen ? t("Post") : t("Create Post")}
                  </span>
                </button>
                <hr className="border-neutral-400 w-3/4 mx-auto" />
                <button
                  className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.error(t("Please login to write an article"));
                      return;
                    }

                    navigate("/posts/create");
                    if (window.innerWidth < 768) {
                      handleToggleSidebar();
                    }
                    close();
                  }}
                >
                  <LuPencilLine className="size-4" />
                  <span className="text-sm">
                    {!isOpen ? t("Write") : t("Write Article")}
                  </span>
                </button>
      
                <hr className="border-neutral-400 w-3/4 mx-auto" />
                <button
                  className="flex items-center justify-center gap-2 cursor-pointer py-3 px-3 hover:text-primary-400"
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.error(t("Please login to create a podcast"));
                      return;
                    }

                    navigate("/podcast/create");
                    if (window.innerWidth < 768) {
                      handleToggleSidebar();
                    }
                    close();
                  }}
                >
                  <LuMic className="size-4" /> 
                  <span className="text-sm">
                    {!isOpen ? t("Podcast") : t("Create Podcast")}
                  </span>
                </button>
              </div>
            )}
          </PopoverPanel>
        </Popover>
      </div>

      <div className="md:hidden" onClick={handleGotoCommuniquePage}>
        <div className="p-4 ">
          <div className="flex gap-2">
            <img src={commuLeft} alt="star" />
            {/* <StarToggle isCommunique={isCommunique} onToggle={setIsCommunique} /> */}
            {isOpen && <div className="line-clamp-1">{t(`Communiques`)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;