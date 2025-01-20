import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuBadgeCheck, LuBriefcase, LuMapPin } from 'react-icons/lu';
interface ProfileDetailsProps {
  name: string;
  town: string;
  occupation: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name, town, occupation }) => {
  const { t } = useTranslation();

  return (
    <div className="text-neutral-50">
      <div className="flex font-semibold gap-2">
        {name}
        <LuBadgeCheck className="size-4" />
      </div>
      <p className="text-[13px]">{occupation}</p>
      <div className="flex text-[13px] gap-3 mt-1">
        <div className="flex gap-1">
          <LuBriefcase className="size-4" /> Writer
        </div>
        <div className="flex gap-1">
          <LuMapPin className="size-4" /> {town},Cameroon
        </div>
      </div>
      <div className="flex text-[13px] gap-3 mt-1 items-center">
        <div className="flex gap-1">
          <p className="font-bold">123</p> {t(`Following`)}
        </div>
        <div className="w-[5px] h-[5px] rounded-full bg-neutral-50 "></div>
        <div className="flex gap-1">
          <p className="font-bold">173</p> {t(`Followers`)}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
