import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import {  useUnfollowUser } from "../../Follow/hooks";
import { useKnowUserFollowings } from "../../Follow/hooks/useKnowUserFollowings";
import { toast } from "react-toastify";
import SignInPopUp from "../../AnonymousUser/components/SignInPopUp";
import { useSendFollowNotification } from "../../Notifications/hooks/useNotification";


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
  const { authUser, isLoggedIn } = useUser();
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();
  const { mutate: unFollow, isPending: isUnfollowPending } = useUnfollowUser();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
   const {mutate: follow, isPending: isFollowPending} = useSendFollowNotification();


  const handleEditProfile = (username: string) => {
    navigate(`/profile/edit/${username}`);
  };

  const handleViewAnalytics = (username: string) => {
    navigate(`/profile/analytics/${username}`);
  };

  const handleFollowClick = () => {
    if (!isLoggedIn) {

      setShowSignInPopup(true);
      return;
    }

    if (isFollowPending || isUnfollowPending) return;

    if (isUserFollowing(userId)) {
      unFollow(userId, {
        onSuccess: () => toast.success(t("profile.alerts.unfollowSuccess")),
        onError: () => toast.error(t("profile.alerts.unfollowFailed")),
      });
    } else {
      follow({receiver_id:userId}, {
        onSuccess: () => toast.success(t("profile.alerts.followSuccess")),
        onError: () => toast.error(t("profile.alerts.followFailed")),
      });
    }
  };

  const getFollowStatusText = () => {
    if (isFollowPending) return t("profile.alerts.following");
    if (isUnfollowPending) return t("profile.alerts.Unfollowing");
    return isUserFollowing(userId) ? t("profile.alerts.following") : t("profile.alerts.follow");
  };

  return (
    <div className="flex gap-2 text-neutral-50 justify-start my-6 md:mt-0 md:justify-center items-center relative">
      {isAuthUser ? (
        <>
          <button
            className="px-6 py-3 border text-neutral-50 border-neutral-100 text-[14px] rounded-full text-sm hover:bg-neutral-600 hover:border-transparent transition-all duration-300 ease-in-out hover:transform-none"
            onClick={() => handleEditProfile(authUser?.username || "")}
          >
            {t("Edit Profile")}
          </button>
          <button
            className="px-6 py-3 text-neutral-50 bg-neutral-600 border border-neutral-600 rounded-full text-[14px] hover:bg-transparent hover:border-neutral-50 transition-all duration-300 ease-in-out hover:transform-none"
            onClick={() => handleViewAnalytics(authUser?.id || "")}
          >
            {t("View Analytics")}
          </button>
        </>
      ) : (
        <>
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
          {showSignInPopup && (
            <SignInPopUp
              text="follow" 
              position="below" 
              onClose={() => setShowSignInPopup(false)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfileHeroButtons;