import React, { useCallback, useEffect, useState } from "react";
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
import { useFollowUser, useUnfollowUser } from "../../../Follow/hooks";
import { useKnowUserFollowings } from "../../../Follow/hooks/useKnowUserFollowings";
import { useUser } from "../../../../hooks/useUser";

interface BlogProfileProps {
  id: string;
  date: string;
  article_id: string;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date, article_id }) => {
  const {authUser} = useUser()
  const { user } = useGetUserById(id || "");
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const { mutate: followUser, isPending: isFollowPending,isSuccess: isFollowSuccess } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending,isSuccess: isUnfollowSuccess } =
    useUnfollowUser();
  const { isFollowing } = useKnowUserFollowings();
  const [saved, setSaved] = useState(false);
  const {
    mutate: updateUser,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateUser();


  const handleProfileClick = (username: string) => {
    goToProfile(username);
  };

  const handleFollowClick = useCallback(() => {
    if (isFollowing(id)) {
      unfollowUser(id);
    } else {
      followUser(id);
    }
  }, [isFollowing, id, unfollowUser, followUser]);

 const handleSavedArticle = () => {
   const updatedSavedArticles = [...(authUser?.saved_articles || []), article_id];
   console.log({ saved_articles: updatedSavedArticles });
   updateUser({ saved_articles: updatedSavedArticles });
 };

  useEffect(() => {
    console.log('reaching here', authUser?.username, authUser?.saved_articles, article_id,)
    if (authUser?.saved_articles?.includes(article_id)) {
      console.log('saved this aricle', article_id)
      setSaved(true);
    } else {
      console.log('not saved this article', article_id)
    }
  }, [authUser?.saved_articles, article_id,authUser?.username]);

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
          {!isFollowing(id) && (
            <div onClick={handleFollowClick} className="cursor-pointer">
              {isFollowPending ? (
                "Following..."
              ) : (
                <div>{isFollowSuccess ? "" : "Follow"}</div>
              )}
            </div>
          )}
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
                <Bookmark size={18} className="text-neutral-500" />{" "}
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
                {isFollowing(id) ? (
                  <div>
                    {isUnfollowPending ? (
                      "Unfollowing..."
                    ) : (
                      <div>
                        {isUnfollowSuccess
                          ? "Follow Author"
                          : "Unfollow Author"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {isFollowPending ? (
                      <div>Following...</div>
                    ) : (
                      <div>
                        {isFollowSuccess ? "Unfollow Author" : "Follow Author"}
                      </div>
                    )}{" "}
                  </div>
                )}
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
