import React, { ReactNode, useContext } from "react";
import { FaBars, FaTimes, FaRegUserCircle } from "react-icons/fa"; 
import { SidebarContext } from "../../../context/SidebarContext/SidebarContext";
import { useUser } from "../../../hooks/useUser";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { favicon } from "../../../assets/icons"; // Assuming this path is correct

interface TopbarProps {
  children: ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useContext(SidebarContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isLoggedIn } = useUser();

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
 
    <div className="h-[120px] sm:h-[80px] transition-all duration-[.5s] ease-linear w-full sm:border-b-[1px] border-neutral-500 flex flex-col justify-center sm:px-5 sticky top-0 z-[900] bg-background">
      <div className="flex items-center justify-between px-6 h-[60px] sm:hidden">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/feed")} 
        >
          <img src={favicon} alt="platform icon" className="h-8 w-8 object-contain" />
        </div>

       
        <div
          className="hamburger-menu"
          aria-label="Toggle sidebar"
          onClick={handleToggleSidebar}
        >
          {isOpen ? (
            <FaTimes onClick={handleToggleSidebar} size={24} className="cursor-pointer text-neutral-50" /> 
          ) : (
            <FaBars  size={24} className="cursor-pointer text-neutral-50" /> 
          )}
        </div>
      </div>


      <div className="flex items-center justify-center px-4 h-[60px] sm:hidden">
         {children}
      </div>

   
      <div className="hidden sm:flex px-4 items-center justify-between w-full h-full">
        <div className="flex w-full items-center gap-2">
          {children}
        </div>
        <div>
          {!isLoggedIn && (
            <button
              type="button"
              className="md:flex hidden items-center w-40 justify-center gap-2 py-1 text-neutral-50 rounded-md shadow-sm hover:bg-primary-700 transition-colors"
              onClick={() => navigate("/auth")}
            >
              <FaRegUserCircle size={16} className="text-main-green" />
              {t("Sign In")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;