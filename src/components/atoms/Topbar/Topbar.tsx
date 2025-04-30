import React, { ReactNode, useContext } from 'react';
import { FaBars, FaRegUserCircle } from "react-icons/fa"; 
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';
import { useUser } from '../../../hooks/useUser';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  children: ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useContext(SidebarContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {isLoggedIn} = useUser();
  const handleToggleSidebar = () => {
    console.log("Toggle sidebar", isOpen);
    toggleSidebar();
  };
  return (
    <div className="h-[120px] sm:h-[80px] transition-all duration-[.5s] ease-linear w-full sm:border-b-[1px] border-neutral-500 flex flex-col justify-center sm:px-5 sticky top-0 z-[900] bg-background">
      <div className="hamburger-menu sticky top-0 p-4  sm:hidden " aria-label="Toggle sidebar">
        <FaBars size={24} className="cursor-pointer" onClick={handleToggleSidebar}/>
      </div>
      <div className='flex px-4 items-center gap-2'>{children} <div>   { !isLoggedIn &&   <button type="button"
                            className="flex items-center w-40 justify-center gap-2 py-1 text-neutral-50 rounded-md shadow-sm hover:bg-primary-700 transition-colors"
                            onClick={() => navigate('/auth')} 
                          >
                            <FaRegUserCircle size={16} className="text-main-green" />
                            {t("Sign In")}
                          </button> }</div> </div>
    
    </div>
  );
};

export default Topbar;
