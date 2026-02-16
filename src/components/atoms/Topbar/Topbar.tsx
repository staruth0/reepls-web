import React, { useState, useEffect, useContext } from 'react';
import { Bell, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { t } from 'i18next';
import { cn } from '../../../utils';
import { CognitiveModeContext } from '../../../context/CognitiveMode/CognitiveModeContext';
import { useNotificationsValues } from '../../../feature/Notifications/hooks';


interface TopbarProps {
  children?: React.ReactNode;
}

const Topbar: React.FC<TopbarProps> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [, setLastShown] = useState<number | null>(null);
  const { isCognitiveMode, toggleCognitiveMode } = useContext(CognitiveModeContext);

  const { notifications } = useNotificationsValues();
  const unreadNotifications = notifications?.filter((notif) => !notif.is_read);

  const unreadCount = unreadNotifications.length;

  const location = useLocation();

  // Key for localStorage
  const STORAGE_KEY = 'cognitiveModePopupLastShown';

  // On mount, check if the popup should show based on last shown time
  useEffect(() => {
    // Get the last shown timestamp from localStorage
    const storedLastShown = localStorage.getItem(STORAGE_KEY);
    const currentTime = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    setLastShown(storedLastShown ? parseInt(storedLastShown) : null);

    // Show popup if 15 minutes have passed since last shown
    if (storedLastShown && currentTime - parseInt(storedLastShown) >= fifteenMinutes) {
      setShowPopup(true);
      localStorage.setItem(STORAGE_KEY, currentTime.toString());
    }
  }, []);

  // Auto-dismiss popup after 8 seconds
  useEffect(() => {
    if (showPopup) {
      const autoDismissTimer = setTimeout(() => {
        setShowPopup(false);
      }, 8000);

      return () => clearTimeout(autoDismissTimer);
    }
  }, [showPopup]);

  const handleBrainClick = () => {
    toggleCognitiveMode();
  };

  // Handle hover to show popup immediately
  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Update the last shown time when manually closed
    const currentTime = Date.now();
    localStorage.setItem(STORAGE_KEY, currentTime.toString());
    setLastShown(currentTime);
  };

  // Framer Motion animation variants
  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Dynamic message based on mode
  const popupMessage = isCognitiveMode
    ? t("Cognitive Mode is on! Images are hidden. Turn it off to see pictures.")
    : t("Cognitive Mode is off! Turn it on to hide images and focus better.");

  return (
    <div className="w-full h-[90px] border-b border-neutral-500 sticky top-0 z-[8100] bg-background flex items-center justify-between px-4">
      <div className={`${!location.pathname.includes('/search') || !location.pathname.includes('/post/create')? 'w-full flex-1 ': ''}`}>
      {children}
      </div>  
      {(!location.pathname.includes('/search') && !location.pathname.includes('/create') && !location.pathname.includes('/article/edit')) && <div className='flex items-center gap-2 px-2'>
        <div className="relative">
          <Brain
          
            className={cn(
              isCognitiveMode ? 'text-primary-400' : 'text-neutral-100',
              'cursor-pointer transition-all duration-300 ease-in-out size-6',
              'hover:text-primary-400'
            )}
            onClick={handleBrainClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            fill={isCognitiveMode ? '#7ef038' : 'none'}
          />

          {showPopup && (
            <motion.div
              className={cn(
                'absolute top-0 right-12 w-64 p-4 rounded-lg shadow-lg bg-background',
                'z-50'
              )}
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <p className="text-sm font-light leading-relaxed">{popupMessage}</p>
              <button
                onClick={handleClosePopup}
                className="mt-2 text-xs underline hover:text-primary-200 transition-colors"
              >
                {t("Got it!")}
              </button>
            </motion.div>
          )}
        </div>
        <Link to="/notifications" className="relative md:hidden">
          <Bell  className="size-6 text-neutral-100 cursor-pointer hover:text-primary-400" />
       { unreadCount > 0 && <span className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-red-500 text-white size-4 flex justify-center items-center text-xs">{unreadCount}</span>}
        </Link>
      </div>}
    </div>
  );
};

export default Topbar;