import React, { useContext } from 'react'
import { Icons,postIcon } from '../../../assets/icons';
import { useLocation, useNavigate } from 'react-router-dom'
import SidebarItem from '../../atoms/SidebarItem';
import './sidebar.scss'
import { ModalContext } from '../../../context/PostModal/PostModalContext';


const Sidebar:React.FC = () => {
const navigate = useNavigate()
  const location = useLocation()
 
  const { isModalOpen, openModal, numberOftimesModalOpened } = useContext(ModalContext);

      
  function handleCreatePostBtnClick() {
    if (numberOftimesModalOpened > 0) {
          navigate("/posts/create");
        }
    else {
      openModal()
        }
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
        {location.pathname.includes("/posts/create") ? (
          <div className='create__post__btn__text'>Creating Post...</div>
        ) : (
          <button className={`create__post__button ${isModalOpen ?'active': null}`} onClick={handleCreatePostBtnClick}>
            <img src={postIcon} alt="post-icon" />
            Create Post
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar