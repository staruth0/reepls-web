import { useGetFollowing } from ".";
import { useUser } from "../../../hooks/useUser";
import { User } from "../../../models/datamodels";

export const useKnowUserFollowings = () => {
  const { authUser } = useUser();
  const { data: followings } = useGetFollowing(authUser?.id || "");

  const isFollowing = (id: string): boolean => {
    return followings?.data.some(
      (following: { followed_id: User }) => following.followed_id.id === id
    );
  };

  return { isFollowing };
};