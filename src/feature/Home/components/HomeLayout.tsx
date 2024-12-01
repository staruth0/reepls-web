import React from "react";
import "../styles/homeLaout.scss";
import SidebarItem from "../../../components/atoms/SidebarItem";
import { Icons,postIcon } from "../../../assets/icons";
import TopbarAtom from "../../../components/atoms/topbarAtom";
import TopRightComponent from "../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../components/molecules/RightRecentComponent";
import RightOlderComponent from "../../../components/molecules/RightOlderComponent";
import { Outlet } from "react-router-dom";


const navLinks = [
  {
    icon: <Icons.HomeIcon color="#737373" />,
    name: "Home",
    link: "/feed",
  },
  {
    icon: <Icons.SearchIcon color="#737373" />,
    name: "Search",
    link: "/feed/search",
  },

  {
    icon: <Icons.BookmarkIcon color="#737373" />,
    name: "Bookmarks",
    link: "/bookmarks",
  },

  {
    icon: <Icons.NotificationIcon color="#737373" />,
    name: "Notifications",
    link: "/notifications",
  },
  {
    icon: <Icons.ProfileIcon color="#737373" />,
    name: "Profile",
    link: "/profile",
  },
];

const HomeLayout: React.FC = () => {
  return (
    <div className="home__layout">
      <div className="side">
        <div className="logo__position">REEPLS</div>
        <div className="sidebar__links">
          {navLinks.map((navItem, index) => (
            <SidebarItem
              key={index}
              icon={navItem.icon}
              name={navItem.name}
              link={navItem.link}
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
        <TopRightComponent />
        <RightRecentComponent />
        <RightOlderComponent />
      </div>
    </div>
  );
};

export default HomeLayout;
