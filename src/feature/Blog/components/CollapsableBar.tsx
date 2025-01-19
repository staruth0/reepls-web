import React from 'react';
// import { LuArrowLeftRight } from 'react-icons/lu';
// import { arrowLeftRight } from '../../../assets/icons';
import '../styles/callapsablebar.scss';

const CollapsableBar: React.FC = () => {
  return (
    <div className="collapsable__bar">
      <div className="left__section">
        <div>Collapse</div>
        {/* <LuArrowLeftRight className="arrow__icon" /> */}
        {/* <img src={arrowLeftRight} alt="arrow" className="" /> */}
      </div>
      <div className="middle__section">
        <div className="text-title">The long old case of looted art during German colonial rule resu</div>
        <p>The Tangue alongside a number of other historic artwork from the f</p>
      </div>
      <button className="publish__btn">Publish</button>
    </div>
  );
};

export default CollapsableBar;
