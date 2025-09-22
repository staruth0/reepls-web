import React, { useEffect } from "react";
import { useGetPodcastsByUser } from "../../Podcast/hooks";
import PodcastCard2 from "../../Podcast/components/PodcastLayout2";

interface ProfilePodcastsProps {
  userId: string;
}

interface PodcastData {
  id: string;
  audio: {
    url: string;
    storageKey: string;
    duration: number;
    fileSize: number;
    mimeType: string;
    thumbnailUrl?: string;
  };
  authorId: {
    id: string;
    username: string;
    name: string;
    email: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  title: string;
  description: string;
  createdAt: string;
  category: string;
  tags: string[];
  savesCount: number;
  commentsCount: number;
  playCount: number;
  isPublic: boolean;
}

const ProfilePodcasts: React.FC<ProfilePodcastsProps> = ({ userId }) => {
  const {
    data: podcastsData,
    isLoading,
    error,
  } = useGetPodcastsByUser({
    userId,
    page: 1,
    limit: 10,
  });

  
  useEffect(() => {
    console.log("ProfilePodcasts - Hook data:", {
      podcastsData,
      isLoading,
      error,
      userId,
    });
  }, [podcastsData, isLoading, error, userId]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-neutral-700 rounded"></div>
            <div className="h-20 bg-neutral-700 rounded"></div>
            <div className="h-20 bg-neutral-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400">Error loading podcasts: {error.message}</p>
      </div>
    );
  }

  if (!podcastsData || !podcastsData.data || podcastsData.data.results.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-neutral-400">No podcasts found for this user.</p>
      </div>
    );
  }

  // Transform the podcast data to match the PodcastCard2 interface
  const transformPodcastData = (podcast: PodcastData) => {
    const duration = podcast.audio?.duration ? `${Math.round(podcast.audio.duration / 60)} min` : 'Unknown';
    const publishDate = new Date(podcast.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return {
      id: podcast.id,
      thumbnailUrl: podcast.audio?.thumbnailUrl || `https://placehold.co/128x128/444444/FFFFFF?text=Podcast`,
      author: {
        id: podcast.authorId.id,
        username: podcast.authorId.username,
        name: podcast.authorId.name,
        profileImage: podcast.authorId.profileImage || `https://placehold.co/40x40/444444/FFFFFF?text=${podcast.authorId.name?.charAt(0) || 'U'}`,
        isVerified: podcast.authorId.isVerified || false,
      },
      title: podcast.title,
      description: podcast.description,
      publishDate,
      listenTime: duration,
      likes: podcast.savesCount || 0,
      comments: podcast.commentsCount || 0,
      isBookmarked: false, // This would need to be determined based on user's bookmarked podcasts
    };
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-neutral-100 mb-4">
        Podcasts ({podcastsData.data.totalResults})
      </h3>
      <div className="space-y-4">
        {podcastsData.data.results.map((podcast: PodcastData) => (
          <PodcastCard2
          
            key={podcast.id}
            podcast={transformPodcastData(podcast)}
            onComment={(podcastId) => {
              console.log(`Comment clicked for podcast: ${podcastId}`);
              // Handle comment action
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePodcasts;
