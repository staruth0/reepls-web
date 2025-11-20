import { EllipsisIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Publication } from '../../../models/datamodels';
import { useDeletePublication } from '../Hooks';
import { toast } from 'react-toastify';



interface AuthorListItemNoCheckboxProps {
  author: Publication;
}

const StreamItemEllipsis: React.FC<AuthorListItemNoCheckboxProps> = ({ author }) => {
  const navigate = useNavigate();
  const id = author._id; 
  const deletePublication = useDeletePublication();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    navigate(`/stream/edit/${author._id}`);
  };

  const handleDelete = () => {
    setIsPopupOpen(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deletePublication.mutate(id || '', {
      onSuccess: () => {
        toast.success('Stream deleted successfully');
        setShowDeleteConfirm(false);
      },
      onError: (error: any) => {
        toast.error('Failed to delete stream. Please try again.');
        console.error('Delete error:', error);
        setShowDeleteConfirm(false);
      }
    });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex items-center py-2 w-full relative">
        <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center rounded-full bg-primary-400 text-white font-bold mr-3 flex-shrink-0 aspect-square">
          {author.title?.charAt(0)?.toUpperCase() || 'S'}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-100 mb-4">
              Delete Stream
            </h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete "{author.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-neutral-600 text-neutral-100 rounded-md hover:bg-neutral-700 transition-colors"
                disabled={deletePublication.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deletePublication.isPending}
              >
                {deletePublication.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StreamItemEllipsis;
