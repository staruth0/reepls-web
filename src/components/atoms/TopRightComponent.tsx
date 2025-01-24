import React from 'react';
import { useTranslation } from 'react-i18next';
import {  LuStar } from 'react-icons/lu';

import './index.scss';

const TopRightComponent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="right__top__bar">
      <div>
        {/* <img src={commuLeft} alt="star" /> */}
        <LuStar className="size-6 bg-main-yellow rounded-full p-1" strokeWidth={2.5} />
      <div>{t(`Communiques`)}</div>
      </div>
     
    </div>
  );
};

export default TopRightComponent;
