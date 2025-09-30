import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: string) => void;
  initialCategory: string;
}

// Example predefined categories (you can expand this)
const predefinedCategories = [
  'Technology',
  'Music',
  'Comedy',
  'Education',
  'News',
  'Sports',
  'Culture',
];

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [customCategory, setCustomCategory] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    const categoryToSave = selectedCategory === 'Custom' ? customCategory.trim() : selectedCategory;
    if (categoryToSave) {
      onSave(categoryToSave);
      onClose();
    }
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
        <h2 className="text-xl font-bold text-neutral-50 mb-4">Add Category</h2>

        <div className="mb-4">
          <label htmlFor="category-select" className="block text-neutral-300 text-sm font-medium mb-2">
            Select a Category:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 bg-neutral-700 text-neutral-50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select --</option>
            {predefinedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Custom">Custom Category</option>
          </select>
        </div>

        {selectedCategory === 'Custom' && (
          <div className="mb-4">
            <label htmlFor="custom-category-input" className="block text-neutral-300 text-sm font-medium mb-2">
              Enter Custom Category:
            </label>
            <input
              id="custom-category-input"
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g., Personal Development"
              className="w-full p-2 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-2 bg-primary-400 text-white font-bold rounded-md hover:bg-primary-500 transition-colors duration-200"
        >
          Save Category
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;