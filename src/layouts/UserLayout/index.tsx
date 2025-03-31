// src/layouts/UserLayout.tsx (adjust path as needed)
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/molecules/sidebar/Sidebar';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { useUser } from '../../hooks/useUser'; // Assuming this is your user hook
import AuthReminderPopup from '../../feature/AnonymousUser/components/AuthReminderComponent';
import './index.scss';

const UserLayout: React.FC = () => {
  const { isOpen } = useContext(SidebarContext);
  const { isLoggedIn } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation(); // Get current route

  useEffect(() => {
    // Don't show popup if user is logged in or route contains "/anonymous"
    if (isLoggedIn || location.pathname.includes('/anonymous')) return;

    // Show popup immediately on mount
    setShowPopup(true);

    // Set up interval for every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      setShowPopup(true);
    }, 300000);

    // Set up timeout to close popup after 15 seconds
    const timeout = setTimeout(() => {
      setShowPopup(false);
    }, 15000);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoggedIn, location.pathname]); // Add location.pathname to dependencies

  // Handle closing popup and setting new timeout
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Reset timeout when popup state changes
  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 4000); // Note: You had 4000ms here instead of 15000ms from original
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  return (
    <div className={`relative sm:grid ${!isOpen ? 'grid-cols-[.5fr_5.5fr]' : 'grid-cols-[1fr_5fr]'}`}>
      <div
        className={`absolute -translate-x-96 sm:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-96'
        } transition-all duration-700 ease-linear sm:relative bg-neutral-800 sm:bg-inherit top-0 bottom-0 z-[990] h-full w-[60%] sm:w-auto`}
      >
        <Sidebar />
      </div>

      <div className="user__content relative">
        <Outlet />
        <AuthReminderPopup isOpen={showPopup} onClose={handleClosePopup} />
      </div>
    </div>
  );
};

export default UserLayout;