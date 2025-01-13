import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './index.scss';

interface sidebarprops {
  NavItemIcon: React.FC<{ className?: string }>;
  link: string;
  name: string;
}

const SidebarItem: React.FC<sidebarprops> = ({ NavItemIcon, name, link }) => {
  const { t } = useTranslation();

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
        <p>{t(`${name}`)}</p>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
