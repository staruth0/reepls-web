import { useGetFollowing } from "./";
import { useUser } from "../../../hooks/useUser";
import { User } from "../../../models/datamodels";

export const useKnowUserFollowings = () => {
  const { authUser } = useUser();
  const { data: followings } = useGetFollowing(authUser?.id || "");

  const isFollowing = (id: string): boolean => {
    
    return followings?.data?.some(
      (following: { followed_id: User | null }) => following.followed_id?.id === id
    ) || false; // Fallback to false if followings or data is null/undefined
  };

  return { isFollowing };
};