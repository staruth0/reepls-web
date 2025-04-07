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
  bio: string;
  role: string;
  isverified:boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name, town,role,user_id,bio,isverified }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { goToFollowingsPage } = useRoute();
  const { data: followingData } = useGetFollowing(user_id);
  const { data: followersData } = useGetFollowers(user_id);

  const handleGotoProfileSettings =()=>{
    navigate('/profileSettings')
  }

  const handleFollowingsClick = () => { 
    // Handle followings click
    goToFollowingsPage(`${user_id}`);
    
  }

  return (
    <div className="text-neutral-50">
      <div className='flex justify-between items-center sm:block '>
        <div>
        <div className="flex font-semibold gap-2">
        {name}
      {isverified &&  <LuBadgeCheck className="size-4 text-primary-400 mt-1" />}
      </div>
      <p className="text-[13px]">{bio}</p>
        </div>
        <div className='sm:hidden' onClick={handleGotoProfileSettings} >
        <Settings className="w-5 h-5" />
        </div>
      

      </div>
      
      <div className="flex flex-wrap-reverse text-[13px] gap-3 mt-1">
        <div className="flex gap-1">
          <LuBriefcase className="size-4" /> {role}
        </div>
        <div className="flex gap-1">
          <LuMapPin className="size-4" /> {town? `${town},`:''}Cameroon
        </div>
      </div>
      <div className="flex text-[13px] gap-3 mt-1 items-center">
        <div className="flex gap-1 cursor-pointer" onClick={handleFollowingsClick}>
          <p className="font-bold hover:underline">{ followingData?.data?.length || 0 }</p> {t(`Following`)}
        </div>
        <div className="w-[5px] h-[5px] rounded-full bg-neutral-50 "></div>
        <div className="flex gap-1 cursor-pointer" onClick={handleFollowingsClick}>
          <p className="font-bold hover:underline">{ followersData?.data?.length || 0 }</p> {t(`Followers`)}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
