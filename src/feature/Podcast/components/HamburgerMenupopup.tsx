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

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false); // Close the menu after an item is clicked
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Options menu"
      >
        <IoMenu className="size-6 text-neutral-50" />
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