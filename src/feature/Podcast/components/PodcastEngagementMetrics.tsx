import React from 'react';
import { LuThumbsUp, LuMessageSquare, LuBookmark, LuLoader } from 'react-icons/lu';
import { useGetMySavedPodcasts } from '../hooks';
import { useSavePodcastToLibrary, useRemovePodcastFromLibrary } from '../hooks';
import { toast } from 'react-toastify';

interface PodcastEngagementMetricsProps {
  likes: number;
  comments: number;
  isBookmarked?: boolean;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onBookmarkClick?: () => void;
  id: string;
}

const PodcastEngagementMetrics: React.FC<PodcastEngagementMetricsProps> = ({
  likes,
  comments,
  onLikeClick,
  onCommentClick,
  id
}) => {
  // Hooks for saving/removing podcasts
  const { mutate: savePodcast, isPending: isSaving } = useSavePodcastToLibrary();
  const { mutate: removePodcast, isPending: isRemoving } = useRemovePodcastFromLibrary();

  // Get saved podcasts data
  const { data: savedPodcastsData } = useGetMySavedPodcasts({
    page: 1,
    limit: 20,
  });

  // Helper function to get saved podcast IDs
  const getSavedPodcastIds = (savedPodcastsData: any): string[] => {
    if (!savedPodcastsData?.data?.savedPodcasts) {
      return [];
    }
    return savedPodcastsData.data.savedPodcasts.map(
      (savedPodcast: { podcastId: { _id: string } }) => savedPodcast.podcastId._id
    );
  };

  const savedPodcastIds = getSavedPodcastIds(savedPodcastsData);
  const isCurrentPodcastSaved = savedPodcastIds.includes(id);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    if (isSaving || isRemoving) return;

    if (isCurrentPodcastSaved) {
      removePodcast(id, {
        onSuccess: () => {
          toast.success("Removed from bookmarks");
        },
        onError: (error) => {
          toast.error("Failed to remove from bookmarks");
          console.error(error);
        },
      });
    } else {
      savePodcast(
        {
          podcastId: id,
          payload: { playlistCategory: "favorites" },
        },
        {
          onSuccess: () => {
            toast.success("Added to bookmarks");
          },
          onError: (error) => {
            toast.error("Failed to add to bookmarks");
            console.error(error);
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-between gap-6">
      {/* Engagement Icons */}
      <div className="flex items-center gap-3 text-neutral-50">
        <button 
          onClick={onLikeClick} 
          className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200"
        >
          <LuThumbsUp className="size-4" />
          <span className="text-sm">{likes}</span>
        </button>
        <button 
          onClick={onCommentClick} 
          className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200"
        >
          <LuMessageSquare className="size-4" />
          <span className="text-sm">{comments}</span>
        </button>
      </div>

      {/* Bookmark Icon */}
      <button 
        onClick={handleBookmark} 
        className={`hover:text-primary-400 transition-colors duration-200 ${
          isCurrentPodcastSaved ? "text-primary-400" : ""
        }`}
        disabled={isSaving || isRemoving}
      >
        {isSaving || isRemoving ? (
          <LuLoader size={16} className="animate-spin" />
        ) : (
          <LuBookmark
            size={16}
            className={`${
              isCurrentPodcastSaved ? "fill-primary-400 text-primary-400" : ""
            }`}
          />
        )}
      </button>
    </div>
  );
};

export default PodcastEngagementMetrics;