import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuMic } from "react-icons/lu";
import { useGetPodcastsByUser } from "../../Podcast/hooks";
import PodcastCard2 from "../../Podcast/components/PodcastLayout2";

interface ProfilePodcastsProps {
  userId: string;
  isAuthUser?: boolean;
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

const ProfilePodcasts: React.FC<ProfilePodcastsProps> = ({ userId, isAuthUser = false }) => {
  const navigate = useNavigate();
  const {
    data: podcastsData,
    isLoading,
    error,
  } = useGetPodcastsByUser({
    userId,
    page: 1,
    limit: 10,
  });

  console.log("podcastsData profile podcasts", podcastsData);

  const handleCreatePodcast = () => {
    navigate('/podcast/create');
  };

  
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
      <div className="p-4 py-8 text-center flex flex-col items-center gap-4">
        <LuMic className="text-4xl text-neutral-400" />
        {isAuthUser ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-neutral-400 text-base">
              You haven't created any podcasts yet
            </p>
            <button
              onClick={handleCreatePodcast}
              className="flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              <LuMic className="size-4" />
              <span>Create Podcast</span>
            </button>
          </div>
        ) : (
          <p className="text-neutral-400 text-base">
            This user has no podcasts yet oops
          </p>
        )}
      </div>
    );
  }

  // Transform the podcast data to match the PodcastCard2 interface
  const transformPodcastData = (podcast: PodcastData) => {
    const duration = podcast.audio?.duration ? `${Math.round(podcast.audio.duration / 60)} min` : "Unknown";
    const publishDate = new Date(podcast.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      // Some APIs return `_id` instead of `id`
      id: (podcast as any).id || (podcast as any)._id || "",
      thumbnailUrl:
        (podcast as any).thumbnailUrl ||
        podcast.audio?.thumbnailUrl ||
        `https://placehold.co/128x128/444444/FFFFFF?text=Podcast`,
      author: {
        id: (podcast.authorId as any).id || (podcast.authorId as any)._id || "",
        username: podcast.authorId.username,
        name: podcast.authorId.name,
        profileImage:
          podcast.authorId.profileImage ||
          `https://placehold.co/40x40/444444/FFFFFF?text=${
            podcast.authorId.name?.charAt(0) || "U"
          }`,
        isVerified: podcast.authorId.isVerified || false,
      },
      title: podcast.title,
      description: podcast.description,
      publishDate,
      listenTime: duration,
      audioUrl: podcast.audio?.url || "",
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
            key={(podcast as any).id || (podcast as any)._id}
            podcast={transformPodcastData(podcast)}
            onReadMore={(podcastId) => {
              if (!podcastId) return;
              navigate(`/podcast/${podcastId}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePodcasts;
