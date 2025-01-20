import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuCircleArrowLeft, LuStar } from 'react-icons/lu';
// import { arrowLeftRight, commuLeft } from '../../assets/icons';
import { cn } from '../../utils';
import './index.scss';

interface rightTopProbs {
  isExpandedMode: boolean;
  handleExpandedMode: () => void;
}

const TopRightComponent: React.FC<rightTopProbs> = ({ isExpandedMode, handleExpandedMode }) => {
  const { t } = useTranslation();
  return (
    <div className="right__top__bar">
      <div>
        {/* <img src={commuLeft} alt="star" /> */}
        <LuStar className="size-6 bg-main-yellow rounded-full p-1" strokeWidth={2.5} />
        {!isExpandedMode && <div>{t(`Communiques`)}</div>}
      </div>
      <LuCircleArrowLeft
        className={cn('size-7 cursor-pointer ', isExpandedMode && 'rotate')}
        onClick={handleExpandedMode}
      />
      {/* <img
        src={arrowLeftRight}
        alt="arrow"
        className={`${isExpandedMode ? 'rotate' : null}`}
        onClick={handleExpandedMode}
      /> */}
    </div>
  );
};

export default TopRightComponent;
