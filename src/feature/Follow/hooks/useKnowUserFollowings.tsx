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
      setFollowingIds([]);
      followings.data.forEach((following: { followed_id: string }) => {
        setFollowingIds((prev) => [...prev, following.followed_id]);
      });
    }
  }, [followings, authUser?.id]); 

  return { isFollowing };
};