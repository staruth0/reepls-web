import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AddTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: string[]) => void;
  initialTags: string[];
}

const AddTagsModal: React.FC<AddTagsModalProps> = ({ isOpen, onClose, onSave, initialTags }) => {
  const [currentTag, setCurrentTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>(initialTags);

  // Sync with initialTags whenever it changes
  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave(tags);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-50 transition-colors duration-200"
          aria-label="Close"
        >
          <FaTimes className="size-5" />
        </button>
        <h2 className="text-xl font-bold text-neutral-50 mb-4">Add Tags</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddTag();
            }}
            placeholder="Type tag and press Enter"
            className="flex-1 p-2 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors duration-200"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-neutral-700 text-neutral-50 text-sm px-3 py-1 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-neutral-400 hover:text-neutral-50 text-xs ml-1"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2 bg-primary-400 text-white font-bold rounded-md hover:bg-primary-500 transition-colors duration-200"
        >
          Save Tags
        </button>
      </div>
    </div>
  );
};

export default AddTagsModal;
