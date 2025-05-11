import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import "./index.scss";

interface sidebarprops {
  NavItemIcon: React.FC<{ className?: string }>;
  link: string;
  name: string;
  isSidebarcollapsed: boolean;
  badgeContent?: number;
  handleToggleSidebar: () => void;
}

const SidebarItem: React.FC<sidebarprops> = ({
  NavItemIcon,
  name,
  link,
  isSidebarcollapsed,
  badgeContent,
  handleToggleSidebar,
}) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to={link}
      onClick={() => (window.innerWidth < 768 ? handleToggleSidebar() : null)}
      className={({ isActive }) =>
        cn("side__link", {
          active__link: isActive,
        })
      }
      end
    >
      <div className={`sidebar__item relative`}>
        <NavItemIcon className="sidebar__icon" />
        {isSidebarcollapsed && <p>{t(`${name}`)}</p>}
        {typeof badgeContent !== "undefined" &&
          badgeContent !== null &&
          badgeContent > 0 && (
            <div className="absolute inline-flex items-center justify-center size-6 text-xs font-bold text-white bg-red-500 rounded-full -top-3 -start-3">
              {badgeContent}
            </div>
          )}
      </div>
    </NavLink>
  );
};

export default SidebarItem;
