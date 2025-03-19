import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../hooks/useUser";


interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen , toggleSidebar}) => {

    const { t } = useTranslation();
    const authState = useUser()
  

  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 w-3/4 bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-neutral-50 hover:text-gray-900 focus:outline-none"
      >
        <LuX className="h-6 w-6" />
      </button> */}

      <div className="">
        <div className="flex items-center gap-2 mb-8 border-b border-b-neutral-700 pb-3 p-6">
          <img
            src="/Logo.svg"
            alt="Reepl Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-neutral-50">
            Reepls
          </span>
        </div>

        <ul className="space-y-4 px-6">
          <li onClick={toggleSidebar}>
            <a href={`${authState ? 'feed' : 'auth/login/phone'}`} className="text-neutral-50 hover:text-primary-400">
            {t("header.signIn")}
            </a>
          </li>
          <li onClick={toggleSidebar}>
            <a href="/auth/register/phone" className="text-neutral-50 hover:text-primary-400">
            {t("header.signUp")}
            </a>
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