import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext/authContext';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import './index.scss';

const UserLayout: React.FC = () => {
  const { checkTokenExpiration, login } = useContext(AuthContext);
  const { isOpen } = useContext(SidebarContext);
  const navigate = useNavigate();
  // TODO: remove this
  // useEffect(() => {
  //   const checkAndRefresh = async () => {
  //     const isExpired = checkTokenExpiration();
  //     if (isExpired) {
  //       try {
  //         const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  //         if (refreshToken) {
  //           const data = await refreshAuthTokens(refreshToken);
  //           login(data.accessToken);
  //           return;
  //         }
  //       } catch (error) {
  //         console.error("Token refresh failed:", error);
  //       }
  //       navigate("/auth");
  //     }
  //   };

  //   checkAndRefresh();
  // }, []);

  return (
    <div className={`relative sm:grid ${!isOpen ? 'grid-cols-[.5fr_5.5fr]' : 'grid-cols-[1fr_5fr]'}`}>
      <div
        className={`absolute -translate-x-96 sm:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-96'
        } transition-all duration-700 ease-linear sm:relative bg-neutral-800 sm:bg-inherit top-0 bottom-0 z-50 h-full w-[60%] sm:w-auto`}>
        <Sidebar />
      </div>

      <div className="user__content relative">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
