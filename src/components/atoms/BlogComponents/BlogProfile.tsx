// BlogProfile.tsx
import React, { useContext, useEffect, useState } from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { profileAvatar } from '../../../assets/icons';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { useGetUserById, useUpdateUser } from '../../../feature/Profile/hooks';
import { useRoute } from '../../../hooks/useRoute';
import { formatDateWithMonth } from '../../../utils/dateFormater';
import { handleFollowClick } from '../../../utils/followUtils'; // Import the reusable follow function
import './Blog.scss';

interface BlogProfileProps {
  id: string;
  date: string;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date }) => {
  const { authState } = useContext(AuthContext);
  const { user } = useGetUserById(id || '');
  const { user: userData } = useGetUserById(authState?.userId || '');
  const { goToProfile } = useRoute();
  const { mutate } = useUpdateUser();

  // Local state for optimistic update
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userData?.following) {
      setIsFollowing(userData.following.includes(id));
    }
  }, [userData, id]);

  const handleProfileClick = (id: string) => {
    goToProfile(id);
  };

  return (
    <div className="blog-profile">
      <img src={profileAvatar} alt="avatar" onClick={() => handleProfileClick(id)} className="cursor-pointer" />
      <div className="profile-info">
        <div className="profile-name">
          <p className="hover:underline cursor-pointer" onClick={() => handleProfileClick(id)}>
            {user?.username}
          </p>
          <LuBadgeCheck className="size-4" />
          <div
            onClick={() => handleFollowClick(isFollowing, setIsFollowing, userData, id, mutate)}
            className="cursor-pointer">
            {isFollowing ? '' : 'Follow'}
          </div>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>
      <LuEllipsisVertical className="size-4" />
    </div>
  );
};

export default BlogProfile;
