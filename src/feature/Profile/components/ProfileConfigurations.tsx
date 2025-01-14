import React, { useContext, useState } from "react";
import ConfigurationWrapper from "./ConfigurationWrapper";
import { useTranslation } from "react-i18next";
import useTheme from "../../../hooks/useTheme";

const ProfileConfigurations: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVideoAutoPlay, setIsVideoAutoPlay] = useState<boolean>(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

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

  return (
    <div className="profile__configurations px-6 py-4 sticky top-0">
      <div className="text-[16px] text-neutral-50">{t(`Settings`)}</div>
      <div className="actual__settings mt-8 flex flex-col gap-6">
        <ConfigurationWrapper>{t(`Phone Settings`)}</ConfigurationWrapper>
        <ConfigurationWrapper>{t(`View Analytics`)}</ConfigurationWrapper>
        <ConfigurationWrapper>{t(`Drafts`)}</ConfigurationWrapper>
        <ConfigurationWrapper>
          <div>{t(`Default Language`)}</div>
          <div className="relative">
            <div 
              className="flex gap-2 items-center cursor-pointer text-neutral-50"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {languages.find(lang => lang.code === i18n.language)?.label || 'English'}
              <svg 
                className={`w-4 h-4 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-neutral-700 ${
                        i18n.language === language.code ? 'text-primary-400' : 'text-neutral-50'
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
          <div>{t(`Video auto Play`)}</div>
          <div className="flex gap-2 items-center">
            {t(isVideoAutoPlay ? "On" : "Off")}
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
          <div>{t(`Theme`)}</div>
          <div className="flex gap-2 items-center">
            {t(theme === "light" ? "Light" : "Dark")}
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

        <ConfigurationWrapper>{t(`Hibernate Account`)}</ConfigurationWrapper>
        <ConfigurationWrapper>{t(`Close Account`)}</ConfigurationWrapper>
      </div>
    </div>
  );
};

export default ProfileConfigurations;
