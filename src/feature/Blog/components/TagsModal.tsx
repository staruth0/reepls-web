import React, { useState, useEffect } from 'react';
import { LuX, LuPlus, LuTag } from 'react-icons/lu';
import { toast } from 'react-toastify';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: string[]) => void;
  selectedTags: string[];
}

const TagsModal: React.FC<TagsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedTags
}) => {
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(selectedTags);

  // Sync local tags state with selectedTags prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setTags(selectedTags);
    }
  }, [isOpen, selectedTags]);

  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Please enter a tag');
      return;
    }

    const tagToAdd = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    
    if (tags.includes(tagToAdd)) {
      toast.error('Tag already exists');
      return;
    }

    if (tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }

    setTags([...tags, tagToAdd]);
    setNewTag('');
    toast.success('Tag added');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    toast.info('Tag removed');
  };

  const handleSave = () => {
    onSave(tags);
    onClose();
    const addedCount = tags.length - selectedTags.length;
    if (addedCount > 0) {
      toast.success(`${addedCount} new tag${addedCount !== 1 ? 's' : ''} added to article`);
    } else if (tags.length > 0) {
      toast.success('Tags updated successfully');
    } else {
      toast.success('All tags removed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LuTag className="size-5" />
            Manage Tags
          </h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <LuX className="size-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Add new tag input */}
          <div>
            <label className="block text-sm font-medium mb-2">Add New Tag</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2 bg-neutral-700 rounded border border-neutral-600 focus:border-primary-500 focus:outline-none"
                placeholder="Enter tag (e.g., Programming)"
                maxLength={50}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.length >= 10}
                className="px-3 py-2 bg-primary-500 rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LuPlus className="size-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Tags will automatically have # prefix. Max 10 tags allowed.
            </p>
          </div>

          {/* Selected tags display */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Selected Tags ({tags.length}/10)
            </label>
            {tags.length === 0 ? (
              <div className="text-neutral-400 text-sm italic p-3 bg-neutral-700/50 rounded border border-dashed border-neutral-600">
                No tags added yet
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-700/50 rounded border border-neutral-600">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary-500/20 text-primary-300 px-2 py-1 rounded text-sm border border-primary-500/30"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <LuX className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 transition-colors"
            >
              Save Tags
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsModal;
