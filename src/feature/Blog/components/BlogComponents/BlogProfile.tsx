import React, { useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import {
  EllipsisVertical,
  Bookmark,
  EyeOff,
  UserPlus,
  Share2,
} from "lucide-react";
import { profileAvatar } from "../../../../assets/icons";
import { useGetUserById } from "../../../Profile/hooks";
import { useRoute } from "../../../../hooks/useRoute";
import { formatDateWithMonth } from "../../../../utils/dateFormater";
import "./Blog.scss";
import { useFollowUser, useUnfollowUser } from "../../../Interactions/hooks";

interface BlogProfileProps {
  id: string;
  date: string;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date }) => {
  const { user } = useGetUserById(id || "");
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleProfileClick = (username: string) => {
    goToProfile(username);
  };

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollowUser(id, {
        onSuccess: () => setIsFollowing(false),
      });
    } else {
      followUser(id, {
        onSuccess: () => setIsFollowing(true),
      });
    }
  };

  return (
    <div className="blog-profile relative">
      {/* Profile Image */}
      <img
        src={profileAvatar}
        alt="avatar"
        onClick={() => handleProfileClick(user?.username || "")}
        className="cursor-pointer"
      />

      {/* Profile Info */}
      <div className="profile-info">
        <div className="profile-name">
          <p
            className="hover:underline cursor-pointer"
            onClick={() => handleProfileClick(user?.username || "")}
          >
            {user?.username}
          </p>
          <LuBadgeCheck className="size-4" />
          <div onClick={handleFollowClick} className="cursor-pointer">
            {isFollowing ? "" : "Follow"}
          </div>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>

      {/* Ellipsis Icon ,Click to Show Menu*/}
      <div className="relative">
        <EllipsisVertical
          className="size-4 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        />

        {/* Pop-up Menu */}
        {showMenu && (
          <div className="absolute right-0 top-6 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50">
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Bookmark size={18} className="text-neutral-500" /> Add to Saved
            </div>
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <EyeOff size={18} className="text-neutral-500" /> Hide post
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleFollowClick}
            >
              <UserPlus size={18} className="text-neutral-500" />{" "}
              {isFollowing ? "Unfollow" : "Follow author"}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Share2 size={18} className="text-neutral-500" /> Share
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogProfile;
