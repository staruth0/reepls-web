import  { useState } from "react";
import { LuMenu } from "react-icons/lu";
import LeftHeader from "./LeftHeader";
import Sidebar from "../Sidebar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen}/>
      {
        isSidebarOpen && <div className="fixed z-30 inset-0 w-full h-full bg-black/70" onClick={toggleSidebar}></div>
      }

      <div className="flex items-center justify-between px-4 md:px-20 py-4 w-full mx-auto sticky top-0 bg-background">
        <div className="flex items-center gap-2">
          

          <img
            src="/Logo.svg"
            alt="Reepl Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-plain-a">
            Reepls
          </span>
        </div>

        <div className="hidden md:block">
          <LeftHeader />
        </div>

        <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-plain-a hover:text-gray-900 focus:outline-none "
          >
            <LuMenu className="h-6 w-6 p-1 border border-primary-400" />
          </button>
      </div>
    </>
  );
};

export default Header;