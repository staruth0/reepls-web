// src/components/molecules/PodcastPreviewModal/PodcastPreviewModal.tsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import PodcastCard from './PodcastLayout1';


// Re-define the Podcast interface for clarity, matching PodcastCardProps
interface PodcastPreviewData {
  title: string;
  subtitle?: string; // Subtitle is optional
  description: string;
  thumbnailFile: File | null;
  audioFile: File | null;
  tags: string[];
  category: string;
}

interface PodcastPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PodcastPreviewData;
}

const PodcastPreviewModal: React.FC<PodcastPreviewModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  // Generate a temporary URL for the thumbnail file for preview
  const thumbnailUrl = data.thumbnailFile ? URL.createObjectURL(data.thumbnailFile) : 'https://placehold.co/400x200/444444/FFFFFF?text=No+Thumbnail';

  // Current date for publishDate
  const today = new Date();
  const publishDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Placeholder for listenTime (e.g., from audioFile duration, or a static value for preview)
  const listenTime = data.audioFile ? 'XX min' : '0 min'; // In a real app, you'd calculate this

  // Construct dummy podcast data for PodcastCard
  const dummyPodcast = {
    id: 'preview-id',
    thumbnailUrl: thumbnailUrl,
    author: {
      id: 'dummy-author-id',
      name: 'Preview Author',
      avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=A', // Random avatar URL
      isVerified: true,
    },
    title: data.title || 'Untitled Podcast',
    description: data.description || 'No description provided.',
    publishDate: publishDate,
    listenTime: listenTime,
    likes: 0,
    comments: 0,
    isBookmarked: false,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
      <div className="bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-50 transition-colors duration-200"
          aria-label="Close Preview"
        >
          <FaTimes className="size-5" />
        </button>
        <h2 className="text-xl font-bold text-neutral-50 mb-4 text-center">Podcast Preview</h2>

        {/* Render the PodcastCard here */}
        <PodcastCard podcast={dummyPodcast} />

        <div className="mt-4 text-neutral-300 text-sm">
            <p><strong>Subtitle:</strong> {data.subtitle || 'Not provided'}</p>
            <p><strong>Tags:</strong> {data.tags.length > 0 ? data.tags.join(', ') : 'No tags'}</p>
            <p><strong>Category:</strong> {data.category || 'No category'}</p>
            {/* You can add more details here if needed */}
        </div>

      </div>
    </div>
  );
};

export default PodcastPreviewModal;