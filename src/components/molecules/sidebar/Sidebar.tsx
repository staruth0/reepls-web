import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { useContext, useState } from "react";
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
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import SidebarItem from "../../atoms/SidebarItem";
import { useTranslation } from "react-i18next";
import { SidebarContext } from "../../../context/SidebarContext/SidebarContext";
import { cn } from "../../../utils";
import PostModal from "../../../feature/Blog/components/PostModal";
import "./sidebar.scss";
import { reeplsIcon } from "../../../assets/icons";
import { useCreateArticle } from "../../../feature/Blog/hooks/useArticleHook";
import { useUser } from "../../../hooks/useUser";
import { Article } from "../../../models/datamodels";
import { toast } from "react-toastify";
import { Spinner } from "../../atoms/Spinner";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useUser();
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateArticle();
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
      icon: LuSearch,
      name: "Search",
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
      link: `/profile/${authUser?.username}`,
    },
  ];

  const handlePost = (postContent: string, postImages: File[], postVideos: File[]) => {
    const post: Article = {
      content: postContent,
    };

    mutate(post, {
      onSuccess: () => {
        setIsCreatingPost(false);
        console.log("Article created successfully");
        toast.success("Article created successfully");
        navigate("/feed");
      },
      onError: (error) => {
        console.error("Error creating article", error);
        toast.error("Error creating article: " + error);
      },
    });

    console.log("post", post);
    console.log("postContent", postContent);
    console.log("postImages", postImages);
    console.log("postVideos", postVideos);
  };

  return (
    <div className="side">
      <LuCircleChevronRight
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
        <div
          className="text-roboto text-[24px] font-semibold flex gap-2 items-center cursor-pointer"
          onClick={() => navigate("/feed")}
        >
          <img src={reeplsIcon} alt="reeplsicon" className={`${isOpen ? "size-8" : "size-9"}`} />
          {isOpen && "REEPLS"}
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
        <>
          {isPending ? (
            <Spinner />
          ) : (
            <PostModal
              isModalOpen={isCreatingPost}
              setIsModalOpen={setIsCreatingPost}
              handlePost={handlePost}
              isPending={isPending}
            />
          )}
        </>
      )}

      <div className="create__post__btn">
        <Popover className="relative">
          <PopoverButton
            className={cn(
              "create__post__button",
              "disabled:text-neutral-400 disabled:cursor-not-allowed"
            )}
            disabled={isCreatingPost}
          >
            <LuCirclePlus className="create__post__icon" style={{ width: "20px", height: "20px" }} />
            {isOpen && t("Create Post")}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className={cn(
              "PopoverContent flex flex-col bg-red-500 z-50 mt-2",
              !isOpen ? "w-32" : "w-40"
            )}
          >
            <div className="block text-center z-[999]">
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => setIsCreatingPost(true)}
              >
                <LuPlus className="size-4" />
                <span className="text-sm">{!isOpen ? t("Post") : t("Create Post")}</span>
              </button>
              <hr className="border-neutral-400 w-3/4 mx-auto" />
              <button
                className="flex items-center justify-center gap-2 cursor-pointer py-3 px-4 hover:text-primary-400"
                onClick={() => navigate("/posts/create")}
              >
                <LuPencilLine className="size-4" />
                <span className="text-sm">{!isOpen ? t("Write") : t("Write Article")}</span>
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
};

export default Sidebar;