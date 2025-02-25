import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuBadgeCheck, LuBriefcase, LuMapPin } from 'react-icons/lu';
import { useRoute } from '../../../hooks/useRoute';
import { useGetFollowers, useGetFollowing } from '../../Follow/hooks';
interface ProfileDetailsProps {
  name: string;
  town: string;
  occupation: string;
  user_id: string;
  bio: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name, town, occupation,user_id,bio }) => {
  const { t } = useTranslation();
  const { goToFollowingsPage } = useRoute();
  const { data: followingData } = useGetFollowing(user_id);
  const { data: followersData } = useGetFollowers(user_id);


  const handleFollowingsClick = () => { 
    // Handle followings click
    goToFollowingsPage('glo');
    
  }

  return (
    <div className="text-neutral-50">
      <div className="flex font-semibold gap-2">
        {name}
        <LuBadgeCheck className="size-4" />
      </div>
      <p className="text-[13px]">{occupation}</p>
      <div className="flex flex-col-reverse text-[13px] gap-3 mt-1">
        <div className="flex gap-1">
          <LuBriefcase className="size-4" /> {bio}
        </div>
        <div className="flex gap-1">
          <LuMapPin className="size-4" /> {town},Cameroon
        </div>
      </div>
      <div className="flex text-[13px] gap-3 mt-1 items-center">
        <div className="flex gap-1 cursor-pointer" onClick={handleFollowingsClick}>
          <p className="font-bold">{ followingData?.data?.length || 0 }</p> {t(`Following`)}
        </div>
        <div className="w-[5px] h-[5px] rounded-full bg-neutral-50 "></div>
        <div className="flex gap-1 cursor-pointer" onClick={handleFollowingsClick}>
          <p className="font-bold">{ followersData?.data?.length || 0 }</p> {t(`Followers`)}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
