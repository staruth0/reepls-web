import React from 'react';
import { useTranslation } from 'react-i18next';

import { commuLeft } from '../../assets/icons';

const TopRightComponent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4 ">
      <div className='flex gap-2'>
        <img src={commuLeft} alt="star" />
        {/* <LuStar className="size-6 bg-main-yellow rounded-full p-1" strokeWidth={2.5} /> */}
        <div>{t(`Communiques`)}</div>
      </div>
    </div>
  );
};

export default TopRightComponent;
