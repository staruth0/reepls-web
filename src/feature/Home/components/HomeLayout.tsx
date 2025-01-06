import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopbarAtom from '../../../components/atoms/topbarAtom';
import TopRightComponent from '../../../components/atoms/TopRightComponent';
import RightOlderComponent from '../../../components/molecules/RightOlderComponent';
import RightRecentComponent from '../../../components/molecules/RightRecentComponent';
import Sidebar from '../../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import '../styles/layout.scss';

const HomeLayout: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (checkTokenExpiration()) {
      navigate('/auth/login');
    }
  }, [checkTokenExpiration]);

  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
  }

  return (
    <div className={`home__layout  ${isExpandedMode ? 'expanded' : null}`}>
      <Sidebar />
      <div className="main">
        <TopbarAtom />
        <div className="outlet-main">
          <Outlet />
        </div>
      </div>
      <div className="right">
        <TopRightComponent isExpandedMode={isExpandedMode} handleExpandedMode={handleExpandedMode} />
        <RightRecentComponent isExpandedMode={isExpandedMode} />
        <RightOlderComponent isExpandedMode={isExpandedMode} />
      </div>
    </div>
  );
};

export default HomeLayout;
