import { useState, useEffect } from 'react';
import { LuBrain } from 'react-icons/lu';
import { cn } from '../../utils';
import { motion } from 'framer-motion';
import { t } from 'i18next';

const CognitiveModeIndicator = ({
  className = '',
  isActive = false,
  onClick = () => {},
  justLoggedIn = false, // New prop to indicate recent login
}: {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  
  justLoggedIn?: boolean;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [_, setLastShown] = useState<number | null>(null);

  // Key for localStorage
  const STORAGE_KEY = 'cognitiveModePopupLastShown';

  // On mount, check if the popup should show based on last shown time or login
  useEffect(() => {
    // Get the last shown timestamp from localStorage
    const storedLastShown = localStorage.getItem(STORAGE_KEY);
    const currentTime = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    setLastShown(storedLastShown ? parseInt(storedLastShown) : null);

    // Show popup if just logged in or if 15 minutes have passed since last shown
    if (justLoggedIn || (storedLastShown && currentTime - parseInt(storedLastShown) >= fifteenMinutes)) {
      setShowPopup(true);
      localStorage.setItem(STORAGE_KEY, currentTime.toString());
    }
  }, [justLoggedIn]);

  // Auto-dismiss popup after 8 seconds
  useEffect(() => {
    if (showPopup) {
      const autoDismissTimer = setTimeout(() => {
        setShowPopup(false);
      }, 8000);

      return () => clearTimeout(autoDismissTimer);
    }
  }, [showPopup]);

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
  const popupMessage = isActive
    ? t("Cognitive Mode is on! Images are hidden. Turn it off to see pictures.")
    : t("Cognitive Mode is off! Turn it on to hide images and focus better.");

  return (
    <div className="relative">
      <LuBrain
        size={30}
        className={cn(
          className,
          isActive ? 'text-primary-400' : 'text-neutral-100',
          'cursor-pointer transition-all duration-300 ease-in-out',
          'hover:text-primary-400'
        )}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        fill={isActive ? '#7ef038' : 'none'}
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
  );
};

export default CognitiveModeIndicator;