import React, { useEffect, useMemo, useState } from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { Follow } from '../../../models/datamodels';
import { useFollowUser, useGetFollowing, useUnfollowUser } from '../../Follow/hooks';

interface AuthorSuggestionProps {
  username: string;
  title: string;
  id: string;
}

const AuthorSuggestionComponent: React.FC<AuthorSuggestionProps> = ({ username, title, id }) => {
  const { authUser } = useUser();
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || '');
  const [isFollowing, setIsFollowing] = useState(false);

  const followedIds = useMemo(() => {
    return followings?.data?.map((following: Follow) => following.followed_id) || [];
  }, [followings]);

  useEffect(() => {
    setIsFollowing(followedIds.includes(id));
  }, [followedIds, id]);

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isFollowing) {
      unfollowUser(id, {
        onSuccess: () => {
          toast.success('User unfollowed successfully');
          setIsFollowing(false);
        },
        onError: () => toast.error('Failed to unfollow user'),
      });
    } else {
      followUser(id, {
        onSuccess: () => {
          toast.success('User followed successfully');
          setIsFollowing(true);
        },
        onError: () => toast.error('Failed to follow user'),
      });
    }
  };

  const getFollowStatusText = () => {
    if (isFollowPending) return 'Following...';
    if (isUnfollowPending) return 'Unfollowing...';
    return isFollowing ? 'Following' : 'Follow';
  };

  const initial = username.charAt(0).toUpperCase();

  return (
    <div>
      <header className="flex gap-2">
        <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-11 h-11 text-center">
          {initial}
        </span>

        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0 line-clamp-1 text-[15px]">{username}</h2>
            <LuBadgeCheck className="text-primary-400 size-5" strokeWidth={2.5} />
            <div className="text-primary-400 text-[13px]  cursor-pointer hover:underline" onClick={handleFollowClick}>
              {getFollowStatusText()}
            </div>
          </div>

          <p className="text-neutral-100 text-xs whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1">
            {title}
          </p>
        </div>
      </header>
    </div>
  );
};

export default AuthorSuggestionComponent;
