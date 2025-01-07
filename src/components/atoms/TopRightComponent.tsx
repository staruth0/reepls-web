import React from 'react'
import { arrowLeftRight, commuLeft } from '../../assets/icons'
import './index.scss'
import { useTranslation } from 'react-i18next';

interface rightTopProbs {
  isExpandedMode: boolean;
  handleExpandedMode: () => void;
}

const TopRightComponent: React.FC<rightTopProbs> = ({ isExpandedMode, handleExpandedMode }) => {
  const { t } = useTranslation();
  return (
    <div className="right__top__bar">
      <div>
        <img src={commuLeft} alt="star" />
        {!isExpandedMode && <div>{t(`Communiques`)}</div>}
      </div>
      <img src={arrowLeftRight} alt="arrow" className={`${isExpandedMode ? 'rotate': null}`} onClick={handleExpandedMode} />
    </div>
  );
}

export default TopRightComponent