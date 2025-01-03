import React, { useContext, useState } from "react";
import ConfigurationWrapper from "./ConfigurationWrapper";
import { ThemeContext } from "../../../context/Theme/themeContext";

const ProfileConfigurations: React.FC = () => {
    const { theme,toggleTheme} = useContext(ThemeContext);
    const [isVideoAutoPlay, setIsVideoAutoPlay] = useState<boolean>(false);

    const handleToggleTheme = () => {
       
        toggleTheme();
    }

    const handleToggleAutoPlay = () => {
        setIsVideoAutoPlay(!isVideoAutoPlay)
    }




  return (
    <div className="profile__configurations px-6 py-4 sticky top-0">
      <div className="text-[16px] text-neutral-50">Settings</div>
      <div className="actual__settings mt-8 flex flex-col gap-6">
        <ConfigurationWrapper>Phone Settings</ConfigurationWrapper>
        <ConfigurationWrapper>View Analytics</ConfigurationWrapper>
        <ConfigurationWrapper>Drafts</ConfigurationWrapper>
        <ConfigurationWrapper>Default Language(English)</ConfigurationWrapper>
        <ConfigurationWrapper>
          <div>Video auto Play</div>
          <div className="flex gap-2 items-center">
            {isVideoAutoPlay ? "On" : "Off"}
            <div
              className={`w-[40px] h-[20px] bg-neutral-50 rounded-[2rem] flex items-center px-[2px] cursor-pointer ${
                isVideoAutoPlay ? "justify-end" : "justify-start"
              }`}
              onClick={handleToggleAutoPlay}
            >
              <div className="w-[18px] h-[18px] rounded-full bg-white"> </div>
            </div>
          </div>
        </ConfigurationWrapper>
        <ConfigurationWrapper>
          <div>Theme</div>
          <div className="flex gap-2 items-center">
            {theme === "light" ? "Light" : "Dark"}
            <div
              className={`w-[40px] h-[20px] bg-neutral-50 rounded-[2rem] flex items-center px-[2px] cursor-pointer ${
                theme === "light" ? "justify-start" : "justify-end"
              }`}
              onClick={handleToggleTheme}
            >
              <div className="w-[18px] h-[18px] rounded-full bg-white"> </div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>Hibernate Account</ConfigurationWrapper>
        <ConfigurationWrapper>Close Account</ConfigurationWrapper>
      </div>
    </div>
  );
};

export default ProfileConfigurations;
