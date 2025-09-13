import { EllipsisIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Publication } from '../../../models/datamodels';



interface AuthorListItemNoCheckboxProps {
  author: Publication;
}

const StreamItemEllipsis: React.FC<AuthorListItemNoCheckboxProps> = ({ author }) => {
  const navigate = useNavigate();
  const id = author.id; 

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };
    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleEdit = () => {
    setIsPopupOpen(false);
    navigate(`/stream/edit/${author.id}`);
  };

  const handleDelete = () => {
    setIsPopupOpen(false);
   
  };

  return (
    <div className="flex items-center py-2 w-full relative">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-400 text-white font-bold mr-3">
        {author.title.charAt(0)}
      </div>

      {/* Author details section */}
      <div className="flex-grow">
        <p
          onClick={() => navigate(`/stream/${id}`)}
          className="hover:underline cursor-pointer font-medium text-neutral-50 dark:text-neutral-50"
        >
          {author.title}
        </p>
        <p className="text-sm text-neutral-100 dark:text-neutral-300">{author.short_description}</p>
        <p className="text-xs text-neutral-100 dark:text-neutral-400">
          {author.tags?.map((tag) => `#${tag}`).join(' ')}
        </p>
      </div>

      <div className="relative">
        <div
          onClick={togglePopup}
          className="cursor-pointer"
          aria-haspopup="true"
          aria-expanded={isPopupOpen}
        >
          <EllipsisIcon />
        </div>
        {isPopupOpen && (
          <div
            ref={popupRef}
            className="absolute right-0 mt-2 w-40 bg-neutral-700 rounded-md shadow-lg z-10"
          >
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-4 py-2 text-neutral-100 hover:bg-neutral-600 rounded-t-md"
            >
              Edit Stream
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2 text-neutral-100 hover:bg-neutral-600 rounded-b-md"
            >
              Delete Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamItemEllipsis;
