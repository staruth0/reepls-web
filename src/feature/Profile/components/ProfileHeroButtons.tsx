import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import { useFollowUser, useUnfollowUser } from "../../Follow/hooks";
import { useKnowUserFollowings } from "../../Follow/hooks/useKnowUserFollowings";

interface ProfileHeroButtonsProps {
  userId: string;
}

const ProfileHeroButtons: React.FC<ProfileHeroButtonsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authUser } = useUser();
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();

  const { mutate: follow,isPending: isFollowPending,error: followError} = useFollowUser();
  const {mutate: unFollow,isPending: isUnfollowPending,error: unfollowError} = useUnfollowUser();

  const handleEditProfile = (username: string) => {
    navigate(`/profile/edit/${username}`);
  };

  const handleViewAnalytics = (username: string) => {
    navigate(`/profile/analytics/${username}`);
  };

  const handleFollowClick = () => {
    if (isUserFollowing(userId)) {
      unFollow(userId); // Unfollow the user
    } else {
      follow(userId); // Follow the user
    }
  };

  return (
    <div className="flex gap-2 text-neutral-50 justify-center items-center">
      {userId === authUser?.id ? (
        <>
          <button
            className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
            onClick={() => handleEditProfile(authUser?.username || "")}
          >
            {t(`Edit Profile`)}
          </button>
          <button
            className="px-8 py-3 bg-neutral-600 rounded-full text-sm hover:bg-gray-200"
            onClick={() => handleViewAnalytics(authUser?.username || "")}
          >
            {t(`View Analytics`)}
          </button>
        </>
      ) : (
        <div>
          <button
            className={`px-8 py-3 rounded-full text-sm ${
              isUserFollowing(userId)
                ? "bg-neutral-600 text-neutral-50"
                : "bg-main-green text-white"
            }`}
            onClick={handleFollowClick}
          >
            {isUserFollowing(userId)
              ? t(`${isUnfollowPending ? "Unfollowing..." : "Unfollow"}`)
              : t(`${isFollowPending ? "Following..." : "Follow"}`)}
          </button>
          {(followError || unfollowError) && (
            <div className="text-red-500 text-sm mt-2">
              {(followError || unfollowError)?.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeroButtons;
