import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/molecules/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext/authContext";
import { useResponsiveLayout } from "../../hooks/useResposiveLayout";
import { SidebarContext } from "../../context/SidebarContext/SidebarContext";
import "./index.scss";

const UserLayout: React.FC = () => {
  const { isTablet, isMobile } = useResponsiveLayout();
  const { checkTokenExpiration } = useContext(AuthContext);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isTablet);
  const { isOpen } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkTokenExpiration()) {
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    setIsSidebarCollapsed(isTablet);
  }, [isTablet]);

  useEffect(() => {
    if (isMobile) setIsSidebarCollapsed(false);
  }, [isMobile]);

  return (
    <div
      className={`relative sm:grid ${
        isSidebarCollapsed ? "grid-cols-[.5fr_5.5fr]" : "grid-cols-[1fr_5fr]"
      }`}
    >
      <div
        className={`absolute -translate-x-96 sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-96"
        } transition-all duration-700 ease-linear sm:relative bg-neutral-800 sm:bg-inherit top-0 bottom-0 z-50 h-full w-[60%] sm:w-auto`}
      >
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </div>

      <div className="user__content relative">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
