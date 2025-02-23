import React, { useEffect, useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import {
  EllipsisVertical,
  Bookmark,
  EyeOff,
  UserPlus,
  Share2,
  X,
} from "lucide-react";
import { profileAvatar } from "../../../../assets/icons";
import { useGetUserById, useUpdateUser } from "../../../Profile/hooks";
import { useRoute } from "../../../../hooks/useRoute";
import { formatDateWithMonth } from "../../../../utils/dateFormater";
import "./Blog.scss";
import {
  useFollowUser,
  useGetFollowing,
  useUnfollowUser,
} from "../../../Follow/hooks";
import { useUser } from "../../../../hooks/useUser";
import { Follow } from "../../../../models/datamodels";
import { toast } from "react-toastify"; 

interface BlogProfileProps {
  id: string;
  date: string;
  article_id: string;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date, article_id }) => {
  const { authUser } = useUser();
  const { user } = useGetUserById(id || "");
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const {
    mutate: followUser,
    isPending: isFollowPending,

  } = useFollowUser();
  const {
    mutate: unfollowUser,
    isPending: isUnfollowPending,

  } = useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || "");
  const [saved, setSaved] = useState(false);
  const {
    mutate: updateUser,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateUser();

  // Extract followed IDs into an array
  const followedIds =
    followings?.data?.map((following: Follow) => following.followed_id) || [];
  const isFollowing = followedIds.includes(id);

  const handleProfileClick = (username: string) => {
    goToProfile(username);
  };

  const handleSavedArticle = () => {
    const updatedSavedArticles = [
      ...(authUser?.saved_articles || []),
      article_id,
    ];
    updateUser({ saved_articles: updatedSavedArticles });
  };

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isFollowing) {
      unfollowUser(id, {
        onSuccess: () => toast.success("User unfollowed successfully"),
        onError: () => toast.error("Failed to unfollow user"),
      });
    } else {
      followUser(id, {
        onSuccess: () => toast.success("User followed successfully"),
        onError: () => toast.error("Failed to follow user"),
      });
    }
  };

  useEffect(() => {
    if (authUser?.saved_articles?.includes(article_id)) {
      setSaved(true);
    }
  }, [authUser?.saved_articles, article_id]);

  const getFollowStatusText = (isMenu = false) => {
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : isMenu ? "Follow author" : "Follow";
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
          <span
            className="cursor-pointer hover:underline"
            onClick={handleFollowClick}
          >
            {getFollowStatusText()}
          </span>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>

      {/* Ellipsis Icon, Click to Show Menu */}
      <div className="relative">
        {showMenu ? (
          <X
            className="size-4 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
        ) : (
          <EllipsisVertical
            className="size-4 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
        )}

        {/* Pop-up Menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-0 z-40"
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 top-6 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50 z-50">
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleSavedArticle}
              >
                <Bookmark size={18} className="text-neutral-500" />
                {saved ? (
                  <div>Saved Post</div>
                ) : (
                  <div>
                    {isUpdatePending ? (
                      <div>Saving...</div>
                    ) : (
                      <div>
                        {isUpdateSuccess ? "Saved Post" : "Add To Saved"}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <EyeOff size={18} className="text-neutral-500" /> Hide post
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleFollowClick}
              >
                <UserPlus size={18} className="text-neutral-500" />
                {getFollowStatusText(true)}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Share2 size={18} className="text-neutral-500" /> Share
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogProfile;
