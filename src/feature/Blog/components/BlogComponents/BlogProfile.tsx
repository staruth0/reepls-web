import { Bookmark, EllipsisVertical, EyeOff, Share2, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { profileAvatar } from "../../../../assets/icons";
import SharePopup from "../../../../components/molecules/share/SharePopup";
import { useRoute } from "../../../../hooks/useRoute";
import { useUser } from "../../../../hooks/useUser";
import { Article, User } from "../../../../models/datamodels";
import { formatDateWithMonth } from "../../../../utils/dateFormater";
import { useFollowUser, useUnfollowUser } from "../../../Follow/hooks";
import { useKnowUserFollowings } from "../../../Follow/hooks/useKnowUserFollowings"; // Import the hook
import { useGetSavedArticles, useRemoveSavedArticle, useSaveArticle } from "../../../Saved/hooks";
import "./Blog.scss";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content: string;
  title: string;
  isArticle: boolean;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ user, date, article_id, title, content, isArticle }) => {
  const { authUser, isLoggedIn } = useUser();
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const location = useLocation();

  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { isFollowing } = useKnowUserFollowings(); // Use the hook
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } = useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const [saved, setSaved] = useState(false);

  const articleUrl = `${window.location.origin}/posts/${isArticle ? "article" : "post"}/${article_id}`;
  const articleTitle = `${title ? title : content.split(" ").slice(0, 10).join(" ") + "..."}`;

  const isCurrentAuthorArticle = user?._id === authUser?._id; // Use _id instead of id

  const handleProfileClick = (username: string) => {
    if (username) {
      goToProfile(username);
    }
  };

  const handleSavedArticle = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
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
    if (!isLoggedIn) {
      setShowSignInPopup(true); // Show popup if not logged in
      return;
    }
    console.log('reaching here', isFollowPending, '-', isUnfollowPending, '-', !user?._id);
    if (!user?._id) return;

    console.log('reaching here2');
    if (isFollowing(user?._id)) { // Use _id instead of id
      unfollowUser(user?._id, { // Use _id instead of id
        onSuccess: () => {
          toast.success("User unfollowed successfully");
        },
        onError: () => toast.error("Failed to unfollow user"),
      });
    } else {
      followUser(user?._id, { // Use _id instead of id
        onSuccess: () => {
          toast.success("User followed successfully");
        },
        onError: () => toast.error("Failed to follow user"),
      });
    }
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
    setShowMenu(false);
  };

  const handleEllipsisClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
    } else {
      setShowMenu(!showMenu);
    }
  };

  useEffect(() => {
    const isSaved = savedArticles?.articles?.some((article: Article) => article._id === article_id);
    setSaved(isSaved || false);
  }, [savedArticles, article_id]);

  const getFollowStatusText = (isMenu = false) => {
    if (!isLoggedIn) return "Follow"; // Default text when not logged in
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing(user?._id || "") ? "Following" : isMenu ? "Follow author" : "Follow"; // Use _id instead of id
  };

  const getSaveStatusText = () => {
    if (!isLoggedIn) return "Add To Saved"; // Default text when not logged in
    if (isSavePending) return "Saving...";
    if (isRemovePending) return "Removing...";
    return saved ? "Unsave Post" : "Add To Saved";
  };

  if (!user) {
    return <LuLoader className="size-4 animate-spin my-auto" />;
  }

  return (
    <div className="blog-profile relative">
      <img
        src={profileAvatar}
        alt="avatar"
        onClick={() => handleProfileClick(user?.username || "")}
        className="cursor-pointer"
      />
      <div className="profile-info">
        <div className="profile-name">
          <p
            className="hover:underline cursor-pointer"
            onClick={() => handleProfileClick(user?.username || "")}
          >
            {user?.username || "Default User"}
          </p>
          {user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400 ml-1" />}
          {!location.pathname.includes("/feed/following") && (
            <div>
              {!isCurrentAuthorArticle && (
                <span
                  className={`cursor-pointer text-primary-400 hover:underline ml-1 ${
                    !isLoggedIn ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={handleFollowClick}
                >
                  {getFollowStatusText()}
                </span>
              )}
            </div>
          )}
        </div>
        <p>{user?.bio}</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>
      <div className="relative">
        {showMenu ? (
          <X className="size-4 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
        ) : (
          <EllipsisVertical className="size-3 cursor-pointer" onClick={handleEllipsisClick} />
        )}
        {showMenu && isLoggedIn && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-0 z-40"
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 top-6 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50 z-50">
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                onClick={handleSavedArticle}
              >
                <Bookmark size={18} className="text-neutral-500" />
                <div>{getSaveStatusText()}</div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer">
                <EyeOff size={18} className="text-neutral-500" /> Hide post
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                onClick={handleFollowClick}
              >
                <UserPlus size={18} className="text-neutral-500" />
                {getFollowStatusText(true)}
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                onClick={handleShareClick}
              >
                <Share2 size={18} className="text-neutral-500" /> Share
              </div>
            </div>
          </>
        )}
        {showSignInPopup && (
          <SignInPopUp
            text="follow this user or access these options"
            position="below"
            onClose={() => setShowSignInPopup(false)}
          />
        )}
      </div>
      {showSharePopup && (
        <SharePopup url={articleUrl} title={articleTitle} onClose={() => setShowSharePopup(false)} />
      )}
    </div>
  );
};

export default BlogProfile;