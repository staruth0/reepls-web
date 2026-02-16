import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useKnowUserFollowings } from "../feature/Follow/hooks/useKnowUserFollowings";
import { useUnfollowUser } from "../feature/Follow/hooks";
import { useSendFollowNotification } from "../feature/Notifications/hooks/useNotification";
import { useUser } from "./useUser";
import { t } from "i18next";


interface UseFollowUserProps {
  targetUserId: string | undefined;
}

export function useFollowUser({ targetUserId }: UseFollowUserProps) {
  const { isLoggedIn } = useUser();
  const { isFollowing } = useKnowUserFollowings();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { mutate: followUser, isPending: isFollowPending } = useSendFollowNotification();

  const following = targetUserId ? isFollowing(targetUserId) : false;

  const follow = useCallback(() => {
    if (!isLoggedIn) {
      toast.error(t("auth.pleaseSignIn"));
      return;
    }
    if (!targetUserId) return;

    followUser(
      { receiver_id: targetUserId },
      {
        onSuccess: () => toast.success(t("blog.alerts.userFollowed")),
      }
    );
  }, [isLoggedIn, targetUserId, followUser]);

  const unfollow = useCallback(() => {
    if (!isLoggedIn) {
      toast.error(t("auth.pleaseSignIn"));
      return;
    }
    if (!targetUserId) return;

    unfollowUser(targetUserId, {
      onSuccess: () => toast.success(t("blog.alerts.userUnfollowed")),
    });
  }, [isLoggedIn, targetUserId, unfollowUser]);

  const toggleFollow = useCallback(() => {
    if (following) {
      unfollow();
    } else {
      follow();
    }
  }, [following, follow, unfollow]);

  return {
    isFollowing: following,
    follow,
    unfollow,
    toggleFollow,
    isFollowPending,
    isUnfollowPending,
  };
}
