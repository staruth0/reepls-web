import { useState, useEffect } from 'react';
import { LuBrain } from 'react-icons/lu';
import { cn } from '../../utils';
import { motion } from 'framer-motion';

const CognitiveModeIndicator = ({
  className = '',
  isActive = false,
  onClick = () => {},
}: {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);

  // Show popup after 3 seconds on mount if isActive changes
  useEffect(() => {
    if (isActive !== undefined) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000); // Initial delay of 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Auto-dismiss popup after 30 seconds
  useEffect(() => {
    if (showPopup) {
      const autoDismissTimer = setTimeout(() => {
        setShowPopup(false);
      }, 8000); 

      return () => clearTimeout(autoDismissTimer);
    }
  }, [showPopup]);

  const handleMouseEnter = () => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Framer Motion animation variants
  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Dynamic message based on mode
  const popupMessage = isActive
    ? "Cognitive Mode is on! Images are hidden. Turn it off to see pictures."
    : "Cognitive Mode is off! Turn it on to hide images and focus better.";

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
            Got it
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CognitiveModeIndicator;