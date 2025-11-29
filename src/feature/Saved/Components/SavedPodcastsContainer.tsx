import React from 'react';
import { useGetMySavedPodcasts } from '../../Podcast/hooks';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PodcastCard2 from '../../Podcast/components/PodcastLayout2';
import { Pics } from '../../../assets/images';
import { User } from '../../../models/datamodels';

// Helper function to format duration, as seen in FeedPodcasts.
function formatDuration(sec?: number) {
  if (!sec || isNaN(sec)) return "0 min";
  return `${Math.round(sec / 60)} min`;
}

// Helper function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return "";
  }
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

  const podcasts = savedPodcastsData?.data?.results || [];
  
  if (podcasts.length === 0) {
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

  // Transform API podcast data to match PodcastCard2 interface
  const transformPodcast = (p: any) => {
    // Handle author - the API returns author object directly
    let author: User;
    if (p.author) {
      author = {
        id: p.author.id || "",
        name: p.author.name || p.author.username || "",
        username: p.author.username || "",
        profile_picture: (p.author as any).profilePicture || p.author.profile_picture || "",
        is_verified_writer: (p.author as any).isVerifiedWriter || p.author.is_verified_writer || false,
      };
    } else {
      // Default fallback
      author = { id: "", name: "", username: "", profile_picture: "", is_verified_writer: false };
    }

    return {
      id: p.id || "",
      thumbnailUrl: p.thumbnailUrl || Pics.podcastimg,
      author: author,
      title: p.title || "Untitled Podcast",
      description: p.description || "",
      publishDate: formatDate(p.createdAt),
      listenTime: formatDuration(p.audio?.duration),
      audioUrl: p.audio?.url || "",
      likes: p.likesCount || 0,
      comments: p.commentsCount ?? 0,
      isBookmarked: true,
    };
  };

  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-6">
        {podcasts.map((podcast: any) => {
          const cardPodcast = transformPodcast(podcast);
          
          // Skip if no valid ID
          if (!cardPodcast.id) {
            return null;
          }

          return (
            <div
              key={podcast.id}
              className="cursor-pointer"
              onClick={() => handlePodcastClick(cardPodcast.id)}
            >
              <PodcastCard2
                podcast={cardPodcast}
                onReadMore={handlePodcastClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPodcastsContainer;