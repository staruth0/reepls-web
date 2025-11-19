import React, { useEffect } from 'react';
import { useGetMySavedPodcasts } from '../../Podcast/hooks';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDateWithMonth } from '../../../utils/dateFormater';

import PodcastCard2 from '../../Podcast/components/PodcastLayout2';



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

  if (!savedPodcastsData?.data?.savedPodcasts || (savedPodcastsData.data.savedPodcasts?.length || 0) === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <p className="text-neutral-300 text-center">
          You haven't saved any podcasts yet.
        </p>
        <button
          onClick={() => navigate('/feed/podcasts')}
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
        {(savedPodcastsData?.data?.savedPodcasts || [])
          .filter((savedPodcast: { 
            _id: string;
            podcastId: {
              _id: string;
              thumbnailUrl?: string;
              authorId?: {
                _id: string;
                name: string;
                username?: string;
                profile_picture?: string;
                is_verified_writer?: boolean;
              };
              title?: string;
              description?: string;
              createdAt: string;
              audio?: {
                duration?: number;
              };
              likesCount?: number;
              commentsCount?: number;
            } | null;
          }) => savedPodcast.podcastId !== null) // Filter out null podcastId
          .map((savedPodcast: { 
            _id: string;
            podcastId: {
              _id: string;
              thumbnailUrl?: string;
              authorId?: {
                _id: string;
                name: string;
                username?: string;
                profile_picture?: string;
                is_verified_writer?: boolean;
              };
              title?: string;
              description?: string;
              createdAt: string;
              audio?: {
                duration?: number;
              };
              likesCount?: number;
              commentsCount?: number;
            };
          }) => {
            const podcast = savedPodcast.podcastId;

            // Additional safety check
            if (!podcast) {
              return null;
            }
         
            // Only create cardPodcast if authorId exists
            if (!podcast.authorId) {
              return null;
            }

            const cardPodcast = {
              id: podcast._id,
              thumbnailUrl: podcast.thumbnailUrl || 'https://placehold.co/400x200/444444/FFFFFF?text=Podcast+Thumbnail',
              author: {
                _id: podcast.authorId._id,
                id: podcast.authorId._id,
                name: podcast.authorId.name || 'Unknown',
                username: podcast.authorId.username || '',
                profile_picture: podcast.authorId.profile_picture || '',
                is_verified_writer: podcast.authorId.is_verified_writer || false,
              } as any, // Type assertion to match User type
              title: podcast.title || "Untitled Podcast",
              description: podcast.description || "",
              publishDate: formatDateWithMonth(podcast.createdAt),
              listenTime: formatDuration(podcast.audio?.duration),
              likes: podcast.likesCount || 0,
              comments: podcast.commentsCount || 0,
              isBookmarked: true, 
            };

            return (
              <div
                key={savedPodcast._id}
                className="cursor-pointer"
                onClick={() => handlePodcastClick(cardPodcast.id)}
              >
               
                <PodcastCard2
                  podcast={cardPodcast}
                 
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SavedPodcastsContainer;