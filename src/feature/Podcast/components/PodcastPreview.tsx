import React from "react";
import { FaTimes } from "react-icons/fa";
import PodcastCard from "./PodcastLayout1";
import { useUser } from "../../../hooks/useUser";
import { Pics } from "../../../assets/images";

interface PodcastPreviewData {
  title: string;
  subtitle?: string;
  description: string;
  thumbnailUrl: string;
  audioFile: File | null;
  tags: string[];
  category: string;
}

interface PodcastPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PodcastPreviewData;
}

const PodcastPreviewModal: React.FC<PodcastPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { authUser } = useUser();
  if (!isOpen) return null;

  const today = new Date();
  const publishDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const listenTime = data.audioFile ? "XX min" : "0 min";

  const dummyPodcast = {
    id: "preview-id",
    thumbnailUrl: data.thumbnailUrl,
    author: {
      id: authUser?.id || "", 
      name: authUser?.name || "Anonymous",
      avatarUrl:
        authUser?.profile_picture ||
        Pics.podcastimg,
      isVerified: true,
    },
    title: data.title || "Untitled Podcast",
    description: data.description || "No description provided.",
    publishDate: publishDate,
    listenTime: listenTime,
    likes: 0,
    comments: 0,
    isBookmarked: false,
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] p-4">
      <div className="bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-50 transition-colors duration-200"
          aria-label="Close Preview"
        >
        <FaTimes className="size-5" />
        </button>
        <h2 className="text-xl font-bold text-neutral-50 mb-4 text-center">
          Podcast Preview
        </h2>
        <PodcastCard podcast={dummyPodcast} />
        <div className="mt-4 text-neutral-300 text-sm">
      
          <p>
            <strong>Subtitle:</strong>{" "}
            {data.subtitle || "Not provided"}{" "}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {data.tags.length > 0 ? data.tags.join(", ") : "No tags"}{" "}
          </p>
          <p>
            <strong>Category:</strong>{" "}
            {data.category || "No category"}
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default PodcastPreviewModal;
