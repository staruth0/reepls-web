import { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import LeftHeader from "./LeftHeader";
import Sidebar from "../Sidebar";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navState, setNavstate] = useState(false);
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavstate(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

      {isSidebarOpen && (
        <div
          className="fixed z-30 inset-0 w-full h-full bg-black/80"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`${navState ? "fixed top-0 left-0 right-0 w-screen shadow-sm" : "sticky top-0"
          } navbar flex border-b-neutral-600 border-b items-center justify-between px-5 md:px-16 lg:px-[128px] md:mb-16 py-4 w-full  bg-background z-20 max-w-screen-2xl mx-auto`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/Logo.svg" alt="Reepl Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold text-neutral-50">Reepls</span>
        </div>

        <div className="hidden md:block">
          <LeftHeader />
        </div>

        <div className="flex gap-2 items-center md:hidden">
          <LanguageSwitcher />
          <button
            onClick={toggleSidebar}
            className="p-2 text-neutral-50 hover:text-gray-900 focus:outline-none"
          >
            <LuMenu className="h-6 w-6 border border-primary-400" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;