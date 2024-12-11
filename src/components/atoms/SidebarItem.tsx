import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

interface sidebarprops{
    icon: React.ReactNode,
    link: string,
    name: string,
    active:boolean
}

const SidebarItem:React.FC<sidebarprops> = ({icon,name,link,active}) => {
    return (
      <Link to={link} className='side__link'>
        <div className={`sidebar__item }`}>
          {icon}
          <p className={`${active ? 'active__link' : null}`}>{ name}</p>
        </div>
      </Link>
    );
}

export default SidebarItem