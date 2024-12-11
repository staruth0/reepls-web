import React, { useState } from "react";
import "../styles/homeLaout.scss";
import SidebarItem from "../../../components/atoms/SidebarItem";
import { Icons,postIcon } from "../../../assets/icons";
import TopbarAtom from "../../../components/atoms/topbarAtom";
import TopRightComponent from "../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../components/molecules/RightRecentComponent";
import RightOlderComponent from "../../../components/molecules/RightOlderComponent";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";




const HomeLayout: React.FC = () => {
  const location = useLocation();
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);

   function handleExpandedMode() {
     setIsExpandedMode((prev) => !prev);
  }
  

  const navLinks = [
    {
      icon: (
        <Icons.HomeIcon
          color={location.pathname === "/feed" ? "#57C016 " : "#737373"}
        />
      ),
      name: "Home",
      link: "/feed",
    },
    {
      icon: (
        <Icons.SearchIcon
          color={location.pathname === "/feed/search" ? "#57C016 " : "#737373"}
        />
      ),
      name: "Search",
      link: "/feed/search",
    },

    {
      icon: (
        <Icons.BookmarkIcon
          color={location.pathname === "/bookmarks" ? "#57C016 " : "#737373"}
        />
      ),
      name: "Bookmarks",
      link: "/bookmarks",
    },

    {
      icon: (
        <Icons.NotificationIcon
          color={location.pathname === "/notifications" ? "#57C016 " : "#737373"}
        />
      ),
      name: "Notifications",
      link: "/notifications",
    },
    {
      icon: (
        <Icons.ProfileIcon
          color={location.pathname === "/profile" ? "#57C016 " : "#737373"}
        />
      ),
      name: "Profile",
      link: "/profile",
    },
  ];


  return (
    <div className={`home__layout  ${isExpandedMode ? "expanded" : null}`}>
      <div className="side">
        <div className="logo__position">REEPLS</div>
        <div className="sidebar__links">
          {navLinks.map((navItem, index) => (
            <SidebarItem
              key={index}
              icon={navItem.icon}
              name={navItem.name}
              link={navItem.link}
              active={navItem.link === location.pathname}
            />
          ))}
        </div>
        <div className="create__post__btn">
          <button>
            <img src={postIcon} alt="post-icon" />
            Create Post
          </button>
          
        </div>
      </div>
      <div className="main">
        <TopbarAtom />
        <div className="outlet-main">
          <Outlet />
        </div>
      </div>
      <div className="right">
        <TopRightComponent
          isExpandedMode={isExpandedMode}
          handleExpandedMode={handleExpandedMode}
        />
        <RightRecentComponent isExpandedMode={isExpandedMode} />
        <RightOlderComponent isExpandedMode={isExpandedMode} />
      </div>
    </div>
  );
};

export default HomeLayout;
