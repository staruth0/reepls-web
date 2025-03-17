import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";


interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {

    const { t } = useTranslation();
  

  return (
    <div
      className={`fixed z-40 inset-y-0 left-0 w-3/4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-plain-a hover:text-gray-900 focus:outline-none"
      >
        <LuX className="h-6 w-6" />
      </button> */}

      <div className="">
        <div className="flex items-center gap-2 mb-8 border-b pb-3 p-6">
          <img
            src="/Logo.svg"
            alt="Reepl Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-plain-a">
            Reepls
          </span>
        </div>

        <ul className="space-y-4 px-6">
          <li>
            <a href="#" className="text-gray-700 hover:text-primary-400">
            {t("header.signIn")}
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-primary-400">
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