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
import { useRoute } from "../../../../hooks/useRoute";
import { formatDateWithMonth } from "../../../../utils/dateFormater";
import "./Blog.scss";
import {
  useFollowUser,
  useGetFollowing,
  useUnfollowUser,
} from "../../../Follow/hooks";
import {
  useSaveArticle,
  useRemoveSavedArticle,
  useGetSavedArticles,
} from "../../../Saved/hooks";
import { useUser } from "../../../../hooks/useUser";
import { Article, Follow, User } from "../../../../models/datamodels";
import { toast } from "react-toastify";
import SharePopup from "../../../../components/molecules/share/SharePopup";

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content: string;
  title:string
}

const BlogProfile: React.FC<BlogProfileProps> = ({
  user,
  date,
  article_id,
  title,
  content
}) => {
  const { authUser } = useUser();
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false); // New state for share popup
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || "");
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } =
    useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const [saved, setSaved] = useState(false);

  // Extract followed IDs into an array
  const followedIds =
    followings?.data?.map((following: Follow) => following.followed_id) || [];
  const isFollowing = followedIds.includes(user?.id);

  const handleProfileClick = (username: string) => {
    goToProfile(username);
  };

  const handleSavedArticle = () => {
    if (isSavePending || isRemovePending) return;

    if (saved) {
      removeSavedArticle(article_id, {
        onSuccess: () => {
          toast.success("Article removed from saved");
          setSaved(false);
        },
        onError: () => toast.error("Failed to remove article"),
      });
    } else {
      saveArticle(article_id, {
        onSuccess: () => {
          toast.success("Article saved successfully");
          setSaved(true);
        },
        onError: () => toast.error("Failed to save article"),
      });
    }
  };

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isFollowing) {
      unfollowUser(user?.id || "", {
        onSuccess: () => toast.success("User unfollowed successfully"),
        onError: () => toast.error("Failed to unfollow user"),
      });
    } else {
      followUser(user?.id || "", {
        onSuccess: () => toast.success("User followed successfully"),
        onError: () => toast.error("Failed to follow user"),
      });
    }
  };

  const handleShareClick = () => {
    setShowSharePopup(true); 
    setShowMenu(false); 
  };

  useEffect(() => {
    const isSaved = savedArticles?.some(
      (article: Article) => article._id === article_id
    );
    setSaved(isSaved || false);
  }, [savedArticles, article_id]);

  const getFollowStatusText = (isMenu = false) => {
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : isMenu ? "Follow author" : "Follow";
  };

  const getSaveStatusText = () => {
    if (isSavePending) return "Saving...";
    if (isRemovePending) return "Removing...";
    return saved ? "Unsave Post" : "Add To Saved";
  };

  // Construct the article URL and title for sharing
  const articleUrl = `https://reepls.netlify.app/posts/article/${article_id}`;
  const articleTitle = `${
    title ? title : content.split(" ").slice(0, 10).join(" ") + '...'
  }`; 

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
          <LuBadgeCheck className="size-4 text-primary-400 ml-1" />
          <span
            className="cursor-pointer text-primary-400 hover:underline ml-1"
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
                <div>{getSaveStatusText()}</div>
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
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleShareClick} // Trigger share popup
              >
                <Share2 size={18} className="text-neutral-500" /> Share
              </div>
            </div>
          </>
        )}
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <SharePopup
          url={articleUrl}
          title={articleTitle}
          onClose={() => setShowSharePopup(false)}
        />
      )}
    </div>
  );
};

export default BlogProfile;
