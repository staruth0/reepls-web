import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

interface sidebarprops{
    icon: React.ReactNode,
    link: string,
    name:string
}

const SidebarItem:React.FC<sidebarprops> = ({icon,name,link}) => {
    return (
      <Link to={link} className='side__link'>
        <div className='sidebar__item'>
          {icon}
         <p>{ name}</p>
        </div>
      </Link>
    );
}

export default SidebarItem