import React from "react";
import Sidebar from "../../../components/molecules/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import ProfileConfigurations from "./ProfileConfigurations";

const ProfileLayout: React.FC = () => {
  return (
    <div className="grid w-full grid-cols-[260px_1fr_340px]  min-h-screen ">
      {/* Sidebar Section */}
     
        <Sidebar />
     

      {/* Main Section */}
          <div className="main__section__profile border-r-[1px] border-neutral-500">
              <div className="sticky top-0 font-roboto border-b-[1px] border-neutral-500 h-[80px] flex items-center px-8 text-xl font-medium text-neutral-50 ">
                  Profile
              </div>
        <Outlet />
      </div>

      {/* Right Section */}
      <div className="right__section__profile  ">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default ProfileLayout;
