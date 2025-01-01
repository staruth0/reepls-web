import React, { useContext } from 'react';
import { LuBell, LuBookmark, LuHome, LuPlusCircle, LuSearch, LuUser } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../../context/PostModal/PostModalContext';
import SidebarItem from '../../atoms/SidebarItem';
import './sidebar.scss';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const { isModalOpen, openModal, numberOftimesModalOpened } = useContext(ModalContext);

  function handleCreatePostBtnClick() {
    if (numberOftimesModalOpened > 0) {
      navigate('/posts/create');
    } else {
      openModal();
    }
  }

  const navLinks = [
    {
      icon: LuHome,
      name: 'Home',
      link: '/feed',
    },
    {
      icon: LuSearch,
      name: 'Search',
      link: '/feed/search',
    },
    {
      icon: LuBookmark,
      name: 'Bookmarks',
      link: '/bookmarks',
    },
    {
      icon: LuBell,
      name: 'Notifications',
      link: '/notifications',
    },
    {
      icon: LuUser,
      name: 'Profile',
      link: '/profile',
    },
  ];

  return (
    <div className="side">
      <div className="logo__position">REEPLS</div>
      <div className="sidebar__links">
        {navLinks.map((navItem, index) => (
          <SidebarItem key={index} NavItemIcon={navItem.icon} name={navItem.name} link={navItem.link} />
        ))}
      </div>
      <div className="create__post__btn">
        {location.pathname.includes('/posts/create') ? (
          <div className="create__post__btn__text">Creating Post...</div>
        ) : (
          <button
            className={`create__post__button ${isModalOpen ? 'active' : null}`}
            onClick={handleCreatePostBtnClick}>
            <LuPlusCircle className="create__post__icon" style={{ width: '20px', height: '20px' }} />
            Create Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
