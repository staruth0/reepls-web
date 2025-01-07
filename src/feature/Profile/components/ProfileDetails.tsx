import React from 'react'
import { briefcase, mapPin, VerifiedIcon } from '../../../assets/icons'
import { useTranslation } from 'react-i18next';

const ProfileDetails: React.FC = () => {
  const {t} = useTranslation()

  return (
    <div className="text-neutral-50">
      <div className="flex font-semibold gap-2">
        Ndifor Icha <img src={VerifiedIcon} alt="verified icon" />
      </div>
      <p className="text-[13px]">writer @CMF FA magazine</p>
      <div className="flex text-[13px] gap-3 mt-1">
        <div className="flex gap-1">
          <img src={briefcase} alt="briefcase" className="w-[17px] " /> Writer
        </div>
        <div className="flex gap-1">
          <img src={mapPin} alt="map-pin" /> Yaounde,Cameroon
        </div>
      </div>
      <div className="flex text-[13px] gap-3 mt-1 items-center">
        <div className="flex gap-1">
          <p className="font-bold">123</p> {t(`Following`)}
         </div>
              <div className='w-[5px] h-[5px] rounded-full bg-neutral-50 '></div>
        <div className="flex gap-1">
          <p className="font-bold">173</p> {t(`Followers`)}
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails