import React from 'react'
import { arrowLeftRight, commuLeft } from '../../assets/icons'
import './index.scss'

const TopRightComponent:React.FC = () => {
  return (
    <div className="right__top__bar">
      <div>
        <img src={commuLeft} alt="star" />
        <div>Communiques</div>
      </div>
      <img src={arrowLeftRight} alt="arrow" />
    </div>
  );
}

export default TopRightComponent