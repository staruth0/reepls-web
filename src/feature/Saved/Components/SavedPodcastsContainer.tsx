import React, { useEffect } from 'react';
import { useGetMySavedPodcasts } from '../../Podcast/hooks';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDateWithMonth } from '../../../utils/dateFormater';
import PodcastCard from '../../Podcast/components/PodcastLayout1';



// Helper function to format duration, as seen in FeedPodcasts.
function formatDuration(sec?: number) {
  if (!sec || isNaN(sec)) return "0 min";
  return `${Math.round(sec / 60)} min`;
}

interface SavedPodcastsContainerProps {
  className?: string;
}

const SavedPodcastsContainer: React.FC<SavedPodcastsContainerProps> = ({ className }) => {
  const navigate = useNavigate();

  // Fetch saved podcasts
  const {
    data: savedPodcastsData,
    isLoading,
    isError,
    error,
  } = useGetMySavedPodcasts({
    page: 1,
    limit: 20,
  });

  useEffect(()=>{
    console.log('saved data',savedPodcastsData)
  },[savedPodcastsData])
  
  // Loading, error, and empty states
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-400 mb-4" />
        <p className="text-neutral-300 text-center">
          Loading saved podcasts...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <p className="text-red-400 text-center mb-2">
          Failed to load saved podcasts
        </p>
        <p className="text-neutral-400 text-sm text-center">
          {error?.message || 'Please try again later'}
        </p>
      </div>
    );
  }

  if (!savedPodcastsData?.data?.savedPodcasts || savedPodcastsData.data.savedPodcasts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <p className="text-neutral-300 text-center">
          You haven't saved any podcasts yet.
        </p>
        <button
          onClick={() => navigate('/podcasts')}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          Discover Podcasts
        </button>
      </div>
    );
  }
  

  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-6">
        {savedPodcastsData.data.savedPodcasts.map((savedPodcast) => {
          const podcast = savedPodcast.podcastId;

          // Create the object that matches the PodcastCard's expected props
          const cardPodcast = {
            id: podcast._id,
            thumbnailUrl: podcast.thumbnailUrl || 'https://placehold.co/400x200/444444/FFFFFF?text=Podcast+Thumbnail',
            author: {
              id: podcast.authorId?._id || '',
              name: podcast.authorId?.name || 'Unknown',
              avatarUrl: podcast.authorId?.profile_picture || '',
              isVerified: podcast.authorId?.is_verified_writer || false,
            },
            title: podcast.title || "Untitled Podcast",
            description: podcast.description || "",
            publishDate: formatDateWithMonth(podcast.createdAt),
            listenTime: formatDuration(podcast.audio?.duration),
            likes: podcast.likesCount || 0,
            comments: podcast.commentsCount || 0,
            isBookmarked: true, // It's a saved podcast, so this is always true
          };

          return (
            <div
              key={savedPodcast._id}
              className="cursor-pointer"
              onClick={() => handlePodcastClick(cardPodcast.id)}
            >
              {/* Using PodcastCard with the correctly mapped data */}
              <PodcastCard
                podcast={cardPodcast}
                onLike={() => { /* You can add a like action here if needed */ }}
                onComment={() => { /* You can add a comment action here if needed */ }}
                onBookmark={() => { /* You can add a bookmark action here if needed */ }}
                onFollow={() => { /* You can add a follow action here if needed */ }}
              
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPodcastsContainer;