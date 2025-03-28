import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './index.scss';

interface sidebarprops {
  NavItemIcon: React.FC<{ className?: string }>;
  link: string;
  name: string;
  isSidebarcollapsed: boolean;
  badgeContent?: number;
}

const SidebarItem: React.FC<sidebarprops> = ({ NavItemIcon, name, link, isSidebarcollapsed, badgeContent }) => {
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
      <div className={`sidebar__item relative`}>
        <NavItemIcon className="sidebar__icon" />
        {isSidebarcollapsed && <p>{t(`${name}`)}</p>}

        {badgeContent && (
          <div className="absolute inline-flex items-center justify-center size-6 text-xs font-bold text-white bg-red-500  rounded-full -top-3 -start-3">
            {badgeContent}
          </div>

          // <div className="size-[13px] flex justify-center items-center rounded-full bg-[#FF3E3E] absolute text- text-white p-1  top-0 left-2">
          //   {badgeContent}
          // </div>
        )}
      </div>
    </NavLink>
  );
};

export default SidebarItem;
