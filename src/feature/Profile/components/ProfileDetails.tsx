import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuBadgeCheck, LuBriefcase, LuMapPin } from 'react-icons/lu';
import { useRoute } from '../../../hooks/useRoute';
import { useGetFollowers, useGetFollowing } from '../../Follow/hooks';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ProfileDetailsProps {
  name: string;
  town: string;
  user_id: string;
  username:string
  bio: string;
  role: string;
  isverified:boolean;
  isAuthUser?: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name, town,role,user_id,bio,isverified,username }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { goToFollowingsPage } = useRoute();
  const { data: followingData } = useGetFollowing(user_id);
  const { data: followersData } = useGetFollowers(user_id);

  const handleGotoProfileSettings =()=>{
    navigate('/profileSettings')
  }

  // const handleGotoEditProfile = () => {
  //   navigate(`/profile/edit/${username}`)
  // }

  const handleFollowingsClick = () => { 
    // Handle followings click
    goToFollowingsPage(`${user_id}`);
    
  }

  return (
    <div className="text-neutral-50">
      <div className='flex justify-between items-start sm:block'>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-neutral-50">{name}</h2>
            {isverified && <LuBadgeCheck className="size-5 text-blue-400" />}
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <span className="text-neutral-50 text-sm">@</span>
            <p className="text-neutral-100 text-sm font-medium">{username}</p>
          </div>
          
          {bio ? (
            <p className="text-neutral-100 text-sm leading-relaxed mb-3">{bio}</p>
          ) : (
            <p className="text-neutral-400 text-sm leading-relaxed mb-3">Reepls user</p>
          )}
        </div>
        
        <div className='sm:hidden ml-4' onClick={handleGotoProfileSettings}>
          <Settings className="w-5 h-5 text-neutral-100 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        {role && (
          <div className="flex items-center gap-2 text-neutral-100">
            <LuBriefcase className="size-4 text-neutral-100" />
            <span>{role}</span>
          </div>
        )}
        {town && (
          <div className="flex items-center gap-2 text-neutral-100">
            <LuMapPin className="size-4 text-neutral-100" />
            <span>{town}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-neutral-700   py-1 rounded transition-colors" onClick={handleFollowingsClick}>
          <span className="font-bold text-neutral-100 ">{followingData?.data?.length || 0}</span>
          <span className="text-neutral-200">{t('Following')}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-neutral-100"></div>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-neutral-700 px-2 py-1 rounded transition-colors" onClick={handleFollowingsClick}>
          <span className="font-bold text-neutral-100">{followersData?.data?.length || 0}</span>
          <span className="text-neutral-200">{t('Followers')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
