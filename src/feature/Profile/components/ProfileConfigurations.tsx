import React, { useState } from "react";
import ConfigurationWrapper from "./ConfigurationWrapper";
import { useTranslation } from "react-i18next";
import useTheme from "../../../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import { toast } from "react-toastify";
import { useFCM } from "../../../hooks/useFCM";
import { getVersionDisplayText } from "../../../constants";

const ProfileConfigurations: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVideoAutoPlay, setIsVideoAutoPlay] = useState<boolean>(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState<boolean>(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { authUser, logout: manualLogout } = useUser();
  
  // Use FCM hook for notifications
  const { isSubscribed, subscribeToFCM, unsubscribeFromFCM, isLoading: isFCMLoading } = useFCM();

  const languages = [
    { code: "en", label: t("English") },
    { code: "fr", label: t("French") },
  ];

  // Handle notification toggle
  const handleToggleNotifications = async () => {
    if (!authUser?.id) {
      toast.error(t('Please log in to enable notifications.'));
      return;
    }

    if (isSubscribed) {
      // Unsubscribe from notifications
      const success = await unsubscribeFromFCM();
      if (!success) {
        // Error is already handled in the hook
        return;
      }
    } else {
      // Subscribe to notifications
      const success = await subscribeToFCM();
      if (!success) {
        // Error is already handled in the hook
        return;
      }
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleAutoPlay = () => {
    setIsVideoAutoPlay(!isVideoAutoPlay);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageMenu(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    manualLogout();
    setShowLogoutPopup(false);
    navigate('/auth');
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  // Navigation handlers
  const handleProfileSettingsClick = () => {
    if (authUser?.id) {
      navigate(`/profile/settings/${authUser.username}`);
    } 
  };

  const handleViewAnalyticsClick = () => {
    if (authUser?.id) {
      navigate(`/profile/analytics/${authUser.id}`);
    } 
  };


  // const handleDraftsClick = () => {
  //   if (authUser?.id) {
  //     navigate(`/drafts/${authUser.id}`);
  //   } 
  // };


  const handleTermsClick = () => {
    navigate(`/Terms&Policies`);
  };


  return (
    <div className="profile__configurations px-6 py-2 sticky top-0">
      <div className="text-[16px] text-neutral-50">{t(`Settings`)}</div>
      <div className="actual__settings mt-8 flex flex-col gap-5">
        <ConfigurationWrapper>
          <div
            className="cursor-pointer w-full"
            onClick={handleProfileSettingsClick}
          >
            {t(`profile.profileSettings`)}
          </div>
        </ConfigurationWrapper>
        <ConfigurationWrapper>
          <div
            className="cursor-pointer w-full"
            onClick={handleViewAnalyticsClick}
          >
            {t(`View Analytics`)}
          </div>
        </ConfigurationWrapper>
        <ConfigurationWrapper>
          <div
            className="cursor-pointer w-full"
            onClick={()=>navigate('/stream/management')}
          >
            {t(`Stream Management`)}
          </div>
        </ConfigurationWrapper>
        {/* <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleDraftsClick}>
            {t(`Drafts`)}
          </div>
        </ConfigurationWrapper> */}

        <ConfigurationWrapper>
          <div>{t(`Default Language`)}</div>
          <div className="relative">
            <div
              className="flex gap-2 items-center cursor-pointer text-neutral-50"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {languages.find((lang) => lang.code === i18n.language)?.label ||
                t("English")}
              <svg
                className={`w-4 h-4 transition-transform ${
                  showLanguageMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-neutral-700 ${
                        i18n.language === language.code
                          ? "text-primary-400"
                          : "text-neutral-50"
                      }`}
                      onClick={() => handleLanguageChange(language.code)}
                      role="menuitem"
                    >
                      {language.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`profile.notifications`)}</div>
          <div className="flex gap-2 items-center">
            {t(isSubscribed ? "On" : "Off")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                isSubscribed ? "bg-primary-400" : "bg-gray-400"
              } ${isFCMLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={isFCMLoading ? undefined : handleToggleNotifications}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isSubscribed ? "translate-x-[20px]" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`profile.videoAutoPlay`)}</div>
          <div className="flex gap-2 items-center">
            {t(isVideoAutoPlay ? "On" : "Off")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                isVideoAutoPlay ? "bg-primary-400" : "bg-gray-400"
              }`}
              onClick={handleToggleAutoPlay}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isVideoAutoPlay ? "translate-x-[20px]" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`Theme`)}</div>
          <div className="flex gap-2 items-center">
            {t(theme === "light" ? "Light" : "Dark")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                theme === "light" ? "bg-gray-400" : "bg-primary-400"
              }`}
              onClick={handleToggleTheme}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  theme === "light" ? "translate-x-0" : "translate-x-[20px]"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleTermsClick}>
            {t(`profile.TermsandPolicies`)}
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={() => window.open('https://donations-ashy.vercel.app/', '_blank')}>
            {t(`Donate`)}
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleLogoutClick}>
            {t(`profile.logout`)}
          </div>
        </ConfigurationWrapper>

        {/* Version display */}
        <div className="mt-8 pt-4 border-t border-neutral-600">
          <div className="text-center text-sm text-neutral-400">
            {getVersionDisplayText()}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-5 z-[9999]"
            onClick={handleCancelLogout}
          ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md shadow-lg p-4 sm:p-6 z-[9999] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] flex flex-col items-center">
  <h2 className="text-neutral-50 text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
    {t("Are you sure you want to log out?")}
  </h2>
  <div className="flex justify-end gap-3 sm:gap-4 w-full">
    <button
      className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 bg-neutral-700 text-neutral-50 rounded-md hover:bg-neutral-600 text-sm sm:text-base"
      onClick={handleCancelLogout}
    >
      {t("No")}
    </button>
    <button
      className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 bg-red-500 text-neutral-50 rounded-md hover:bg-red-600 text-sm sm:text-base"
      onClick={handleConfirmLogout}
    >
      {t("Yes")}
    </button>
  </div>
</div>
        </>
      )}
    </div>
  );
};

export default ProfileConfigurations;