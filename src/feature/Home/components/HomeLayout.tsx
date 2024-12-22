import React, { useContext, useState } from "react";
import "../styles/homeLaout.scss";
import TopbarAtom from "../../../components/atoms/topbarAtom";
import TopRightComponent from "../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../components/molecules/RightRecentComponent";
import RightOlderComponent from "../../../components/molecules/RightOlderComponent";
import { Outlet } from "react-router-dom";
import ExpiredToken from "../../../components/atoms/Popups/ExpiredToken";
import { AuthContext } from "../../../context/AuthContext/authContext";
import Sidebar from "../../../components/molecules/sidebar/Sidebar";
import PostModal from "../../../components/molecules/PostModal/PostModal";
import { ModalContext } from "../../../context/PostModal/PostModalContext";

const HomeLayout: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const { isModalOpen } = useContext(ModalContext);
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);


  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
  }

  return (
    <div className={`home__layout  ${isExpandedMode ? "expanded" : null}`}>
      {checkTokenExpiration() && <ExpiredToken />}
      { isModalOpen && <PostModal/>}
      <Sidebar />
      <div className="main">
        <TopbarAtom />
        <div className="outlet-main">
          <Outlet />
        </div>
      </div>
      <div className="right">
        <TopRightComponent
          isExpandedMode={isExpandedMode}
          handleExpandedMode={handleExpandedMode}
        />
        <RightRecentComponent isExpandedMode={isExpandedMode} />
        <RightOlderComponent isExpandedMode={isExpandedMode} />
      </div>
    </div>
  );
};

export default HomeLayout;
