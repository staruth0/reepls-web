import { useEffect, useState } from "react";
import { useGetFollowing } from ".";
import { useUser } from "../../../hooks/useUser";

export const useKnowUserFollowings = () => {
  const { authUser } = useUser();
  const { data: followings } = useGetFollowing(authUser?.id);

  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const isFollowing = (id: string): boolean => followingIds.includes(id);

  useEffect(() => {
    if (followings) {
      const ids = followings.data.map(
        (following: { followed_id: string }) => following.followed_id
      );
      setFollowingIds(ids);
    }
  }, [followings]);

  return { isFollowing };
};
