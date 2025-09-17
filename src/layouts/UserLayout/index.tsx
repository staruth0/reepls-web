import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/molecules/sidebar/Sidebar';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { useUser } from '../../hooks/useUser'; 
import AuthReminderPopup from '../../feature/AnonymousUser/components/AuthReminderComponent';
import './index.scss'; 

const UserLayout: React.FC = () => {
  const { isOpen, toggleSidebar } = useContext(SidebarContext); 
  const { isLoggedIn } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    if (isLoggedIn || location.pathname.includes('/anonymous')) return;

    setShowPopup(true);
    const interval = setInterval(() => {
      setShowPopup(true);
    }, 300000);

    const timeout = setTimeout(() => {
      setShowPopup(false);
    }, 15000);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoggedIn, location.pathname]);


  const handleClosePopup = () => {
    setShowPopup(false);
  };


  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 4000); 
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  // New handler for closing sidebar on smaller screens
  const handleContentClick = () => {

    if (isOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div className={`relative md:grid ${!isOpen ? 'grid-cols-[.5fr_5.5fr]' : 'grid-cols-[1fr_5fr]'}`}>
      <div
        className={`absolute -translate-x-96 sm:translate-x-0 hidden md:block ${
          isOpen ? 'translate-x-0' : '-translate-x-96'
        } transition-all duration-700 ease-linear sm:relative bg-neutral-800 sm:bg-inherit top-0 bottom-0 z-[910] h-full w-[60%] sm:w-auto`}
      >
        <Sidebar />
      </div>

   
      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/30 z-[900]" 
          onClick={handleContentClick}
        ></div>
      )}

      <div className="user__content relative" onClick={handleContentClick}> 
        <Outlet />
        <AuthReminderPopup isOpen={showPopup} onClose={handleClosePopup} />
      </div>
    </div>
  );
};

export default UserLayout;