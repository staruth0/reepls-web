import React, { useContext } from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { profileAvatar } from '../../../assets/icons';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { useGetUserById } from '../../../feature/Profile/hooks';
import { useRoute } from '../../../hooks/useRoute';
import { formatDateWithMonth } from '../../../utils/dateFormater';
import './Blog.scss';
interface BlogProfileProps {
  id: string;
  date: string;
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date }) => {
  const { authState } = useContext(AuthContext);
  const { data } = useGetUserById(id || authState?.userId || '');
  const { goToProfile } = useRoute();

  const handleProfileClick = (id: string) => {
    goToProfile(id);
  };

  const handleFollowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('followed him');
    console.log('User Data:', data);
  };

  return (
    <div className="blog-profile cursor-pointer" onClick={() => handleProfileClick(id)}>
      <img src={profileAvatar} alt="avatar" />
      <div className="profile-info">
        <div className="profile-name">
          <p>{data?.username}</p>
          <LuBadgeCheck className="size-4" />
          <div onClick={handleFollowClick}>Follow</div>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>
      <LuEllipsisVertical className="size-4" />
    </div>
  );
};

export default BlogProfile;
