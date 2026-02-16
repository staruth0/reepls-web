import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../hooks/useUser";
import useTheme from "../../../hooks/useTheme";
import { logoOnDark, logoOnWhite } from "../../../assets/icons";


interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();
  const { theme } = useTheme();

  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 w-3/4 bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="">
        <div className="flex items-center mb-8 border-b border-b-neutral-700 pb-3 p-6">
          <img
            src={theme === "light" ? logoOnDark : logoOnWhite}
            alt="Reepls"
            className="h-8 w-auto object-contain shrink-0"
          />
        </div>

        <ul className="space-y-4 px-6">
          <li onClick={toggleSidebar}>
            <a href={`${ isLoggedIn? 'feed' : 'auth/login/email'}`} className="text-neutral-50 hover:text-primary-400">
            {t("header.signIn")}
            </a>
          </li>
          <li onClick={toggleSidebar}>
            <a href="/auth/register/email" className="text-neutral-50 hover:text-primary-400">
            {t("header.signUp")}
            </a>
          </li>
          <li>
            <ThemeSwitcher variant="menu" />
          </li>
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;