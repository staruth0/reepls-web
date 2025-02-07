import React, { ReactNode, useContext } from 'react';
import { FaBars } from "react-icons/fa"; 
import { SidebarContext } from '../../../context/SidebarContext/SidebarContext';

interface TopbarProps {
  children: ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useContext(SidebarContext);
  const handleToggleSidebar = () => {
    console.log("Toggle sidebar", isOpen);
    toggleSidebar();
  };
  return (
    <div className="h-[120px] sm:h-[80px] transition-all duration-[.5s] ease-linear w-full sm:border-b-[1px] border-neutral-500 flex flex-col justify-center sm:px-5 sticky top-0 z-9999 bg-background">
      <div className="hamburger-menu sticky top-0 p-4  sm:hidden ">
        <FaBars size={24} className="cursor-pointer" onClick={handleToggleSidebar}/>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Topbar;
