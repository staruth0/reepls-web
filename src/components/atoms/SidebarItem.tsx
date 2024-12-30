import cn from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './index.scss';

interface sidebarprops {
  NavItemIcon: React.FC<{ className?: string }>;
  link: string;
  name: string;
}

const SidebarItem: React.FC<sidebarprops> = ({ NavItemIcon, name, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        cn('side__link', {
          active__link: isActive,
        })
      }
      end>
      <div className={`sidebar__item`}>
        <NavItemIcon className="sidebar__icon" />
        <p>{name}</p>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
