import React, { useState, useRef, useEffect } from 'react';
import { IoMenu } from 'react-icons/io5'; // Using IoMenu for a hamburger icon

interface HamburgerMenuProps {
  onPreviewClick: () => void; // Placeholder for future preview
  onAddTagsClick: () => void;
  onAddCategoryClick: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onPreviewClick,
  onAddTagsClick,
  onAddCategoryClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Glowing effect on mount and every 10 seconds
  useEffect(() => {
    // Trigger glow immediately on mount
    setShowGlow(true);
    const timeout = setTimeout(() => setShowGlow(false), 2000); // Glow for 2 seconds

    // Set up interval to repeat every 10 seconds
    const interval = setInterval(() => {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 2000); // Glow for 2 seconds
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false); // Close the menu after an item is clicked
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 relative ${
          showGlow ? 'animate-pulse' : ''
        }`}
        aria-label="Options menu"
      >
        <IoMenu className={`size-6 text-neutral-50 transition-all duration-500 ${
          showGlow ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(126,240,56,0.8)]' : ''
        }`} />
        {showGlow && (
          <span className="absolute inset-0 rounded-full bg-primary-400/30 animate-ping"></span>
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded-md shadow-lg py-1 z-20" // Increased z-index
        >
          <button
            onClick={() => handleMenuItemClick(onPreviewClick)}
            className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
          >
            Preview
          </button>
          <button
            onClick={() => handleMenuItemClick(onAddTagsClick)}
            className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
          >
            Add Tags
          </button>
          <button
            onClick={() => handleMenuItemClick(onAddCategoryClick)}
            className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
          >
            Add Category
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;