// src/components/molecules/AudioUploadOptionsModal/AudioUploadOptionsModal.tsx
import React, { useRef, useEffect } from 'react';

interface AudioUploadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFromFile: () => void;
  onSelectFromListings: () => void;
  position: { top: number; left: number };
}

const AudioUploadOptionsModal: React.FC<AudioUploadOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectFromFile,
  onSelectFromListings,
  position,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      style={{ top: position.top, left: position.left }}
      className="absolute bg-neutral-700 rounded-md shadow-lg py-1 z-20 w-48"
    >
      <button
        onClick={() => {
          onSelectFromFile();
          onClose(); // Close modal after selection
        }}
        className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
      >
        Select from file
      </button>
      <button
        onClick={() => {
          onSelectFromListings();
          onClose(); // Close modal after selection
        }}
        className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
      >
        Select from listings
      </button>
    </div>
  );
};

export default AudioUploadOptionsModal;