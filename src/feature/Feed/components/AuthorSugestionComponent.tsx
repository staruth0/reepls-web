import React from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';
import {  useUnfollowUser } from '../../Follow/hooks';
import { useKnowUserFollowings } from '../../Follow/hooks/useKnowUserFollowings';
import { useNavigate } from 'react-router-dom';
import { useSendFollowNotification } from '../../Notifications/hooks/useNotification';
import { useGetUserByUsername } from '../../Profile/hooks';

interface AuthorSuggestionProps {
  username: string;
  title: string;
  id: string;
  isverified:boolean;
}

const AuthorSuggestionComponent: React.FC<AuthorSuggestionProps> = ({ username, title, id,isverified }) => {
    const {mutate: followUser, isPending: isFollowPending} = useSendFollowNotification();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();
  const {user} = useGetUserByUsername(username)
  const navigate = useNavigate();

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isUserFollowing(id)) {
      unfollowUser(id, {
        onSuccess: () => toast.success('User unfollowed successfully'),
        onError: () => toast.error('Failed to unfollow user'),
      });
    } else {
      followUser({receiver_id:id}, {
        onSuccess: () => toast.success('User followed successfully'),
        onError: () => toast.error('Failed to follow user'),
      });
    }
  };

  const getFollowStatusText = () => {
    if (isFollowPending) return 'Following...';
    if (isUnfollowPending) return 'Unfollowing...';
    return isUserFollowing(id) ? 'Following' : 'Follow';
  };

  const initial = username.charAt(0).toUpperCase();

  return (
    <div>
      <header className="flex gap-2">
      {user?.profile_picture !== 'https://example.com/default-profile.png' ? (
          <img
            src={user?.profile_picture}
            alt="avatar"
            className="cursor-pointer w-10 h-10 rounded-full object-cover"
          />
        ) : (
         <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-12 h-12 text-center">
          {initial  || 'D'}
        </span> 
        )}

        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0 line-clamp-1 text-[15px] hover:cursor-pointer hover:underline" onClick={()=>navigate(`/profile/${username}`)} >{username}</h2>
           {isverified && <LuBadgeCheck className="text-primary-400 size-5" strokeWidth={2.5} />}
            <div
              className="text-primary-400 text-[13px] cursor-pointer hover:underline"
              onClick={handleFollowClick}
            >
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