import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import LeftHeader from "./LeftHeader";
import Sidebar from "../Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import useTheme from "../../../../hooks/useTheme";
import { logoOnDark, logoOnWhite } from "../../../../assets/icons";
import { SECTION_CONTENT_CLASS } from "../LandingPage/sectionLayout";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { theme } = useTheme();

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed z-30 inset-0 w-full h-full bg-black/80"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Full-width bar (fixed or sticky); content inside constrained to section max-width */}
      <div
        className={`navbar z-20 inset-x-0 top-0 w-full ${
          isLanding
            ? "fixed bg-background border-b border-neutral-600 shadow-sm"
            : "sticky bg-background border-b border-neutral-600"
        }`}
      >
        <div className={`flex items-center justify-between py-3 md:py-4 w-full ${SECTION_CONTENT_CLASS} ${isLanding ? "text-foreground" : ""}`}>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
          aria-label="Reepls home"
        >
          <img
            src={theme === "light" ? logoOnDark : logoOnWhite}
            alt="Reepls"
            className="h-6 sm:h-7 md:h-8 w-auto object-contain shrink-0"
          />
        </div>

        <div className="hidden md:flex md:items-center md:gap-2">
          <LeftHeader isLanding={isLanding} />
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className={`p-2 focus:outline-none rounded ${isLanding ? "text-foreground hover:text-primary-400" : "text-neutral-50 hover:text-gray-900"}`}
            aria-label="Open menu"
          >
            <LuMenu className="h-6 w-6" />
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Header;