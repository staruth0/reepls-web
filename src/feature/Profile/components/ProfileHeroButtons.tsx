import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import { useFollowUser, useUnfollowUser } from "../../Follow/hooks";
import { useKnowUserFollowings } from "../../Follow/hooks/useKnowUserFollowings";
import { toast } from "react-toastify";

interface ProfileHeroButtonsProps {
  userId: string;
  isAuthUser: boolean;
}

const ProfileHeroButtons: React.FC<ProfileHeroButtonsProps> = ({
  userId,
  isAuthUser,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authUser } = useUser();
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();

  const { mutate: follow, isPending: isFollowPending } = useFollowUser();

  const { mutate: unFollow, isPending: isUnfollowPending } = useUnfollowUser();

  const handleEditProfile = (username: string) => {
    navigate(`/profile/edit/${username}`);
  };

  const handleViewAnalytics = (username: string) => {
    navigate(`/profile/analytics/${username}`);
  };

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isUserFollowing(userId)) {
      unFollow(userId, {
        onSuccess: () => toast.success(t("User unfollowed successfully")),
        onError: () => toast.error(t("Failed to unfollow user")),
      });
    } else {
      follow(userId, {
        onSuccess: () => toast.success(t("User followed successfully")),
        onError: () => toast.error(t("Failed to follow user")),
      });
    }
  };

  const getFollowStatusText = () => {
    if (isFollowPending) return t("Following...");
    if (isUnfollowPending) return t("Unfollowing...");
    return isUserFollowing(userId) ? t("Following") : t("Follow");
  };

  return (
    <div className="flex gap-2 text-neutral-50 justify-center items-center">
      {isAuthUser ? (
        <>
          <button
            className="px-8 py-3 border text-neutral-50 border-neutral-100 text-[14px] rounded-full text-sm hover:bg-neutral-600 hover:border-transparent transition-all duration-300 ease-in-out hover:transform-none"
            onClick={() => handleEditProfile(authUser?.username || "")}
          >
            {t("Edit Profile")}
          </button>
          <button
            className="px-8 py-3 text-neutral-50 bg-neutral-600 border border-neutral-600 rounded-full text-[14px] hover:bg-transparent hover:border-neutral-50 transition-all duration-300 ease-in-out hover:transform-none"
            onClick={() => handleViewAnalytics(authUser?.username || "")}
          >
            {t("View Analytics")}
          </button>
        </>
      ) : (
        <button
          className={`px-8 py-3 rounded-full text-sm ${
            isUserFollowing(userId)
              ? "bg-neutral-600 text-neutral-50"
              : "bg-main-green text-white"
          }`}
          onClick={handleFollowClick}
        >
          {getFollowStatusText()}
        </button>
      )}
    </div>
  );
};

export default ProfileHeroButtons;
