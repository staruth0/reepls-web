import { useGetFollowing } from ".";
import { useUser } from "../../../hooks/useUser";

export const useKnowUserFollowings = () => {
  const { authUser } = useUser();
  const { data: followings } = useGetFollowing(authUser?.id);

  const isFollowing = (id: string): boolean => {
    return followings?.data.some(
      (following: { followed_id: string }) => following.followed_id === id
    );
  };

  return { isFollowing };
};