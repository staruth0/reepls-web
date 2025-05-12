import React from 'react';
import { LuBadgeCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useUnfollowUser } from '../../Follow/hooks';
import { useKnowUserFollowings } from '../../Follow/hooks/useKnowUserFollowings';
import { useNavigate } from 'react-router-dom';
import { useSendFollowNotification } from '../../Notifications/hooks/useNotification';
import { useGetUserByUsername } from '../../Profile/hooks';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUser';

interface AuthorSuggestionProps {
  username: string;
  name:string;
  title: string;
  id: string;
  isverified: boolean;
}

const AuthorSuggestionComponent: React.FC<AuthorSuggestionProps> = ({ username,name, title, id, isverified }) => {
  const { mutate: followUser, isPending: isFollowPending } = useSendFollowNotification();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();
  const { user } = useGetUserByUsername(username);
  const {authUser} = useUser();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending) return;

    if (isUserFollowing(id)) {
      unfollowUser(id, {
        onSuccess: () => toast.success('User unfollowed successfully'),
        onError: () => toast.error('Failed to unfollow user'),
      });
    } else {
      followUser({ receiver_id: id }, {
        onSuccess: () => toast.success('User followed successfully'),
        onError: () => toast.error('Failed to follow user'),
      });
    }
  };

  const getFollowStatusText = () => {
    if (isFollowPending) return `${t('feed.following')}...`;
    if (isUnfollowPending) return `${t('feed.unfollowing')}...`;
    return isUserFollowing(id) ? `${t('feed.following')}` : `${t('feed.follow')}`;
  };

  return (
    <div>
      <header className="flex gap-2">
        {user?.profile_picture && user?.profile_picture !== 'https://example.com/default-profile.png' && user?.profile_picture !== '' ? (
          <img
            src={user?.profile_picture}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-neutral-600 shadow-sm transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/profile/${username}`)}
              loading="lazy"
          />
        ) : (
          <span
            className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-10 h-10 text-center"
            onClick={() => navigate(`/profile/${username}`)}
          >
            {name?.charAt(0).toUpperCase() || 'D'}
          </span>
        )}
        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2
              className="text-base font-semibold m-0 line-clamp-1 text-[15px] hover:cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${username}`)}
            >
              {name}
            </h2>
            {isverified && <LuBadgeCheck className="text-primary-400 size-5" strokeWidth={2.5} />}
          { user?._id === authUser?.id? "" :  <div
              className="text-primary-400 text-[13px] cursor-pointer hover:underline"
              onClick={handleFollowClick}
            >
              {getFollowStatusText()}
            </div>}
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