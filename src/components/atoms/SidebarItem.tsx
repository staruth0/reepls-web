import cn from 'classnames';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './index.scss';

interface sidebarprops {
  NavItemIcon: React.FC<{ className?: string }>;
  link: string;
  name: string;
}

const SidebarItem: React.FC<sidebarprops> = ({ NavItemIcon, name, link }) => {
  const location = useLocation();
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        cn('side__link', {
          active__link: isActive || location.pathname.startsWith(link),
        })
      }>
      <div className={`sidebar__item`}>
        <NavItemIcon className="sidebar__icon" />
        <p>{name}</p>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
