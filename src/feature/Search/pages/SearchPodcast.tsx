import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetSearchResults } from '../hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PodcastCard2 from '../../Podcast/components/PodcastLayout2';
import { User } from '../../../models/datamodels';
import { Pics } from '../../../assets/images';

interface SearchPodcastProps {
  query: string;
}

interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: User;
  title: string;
  description: string;
  publishDate: string;
  listenTime: string;
  audioUrl: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

const SearchPodcast: React.FC<SearchPodcastProps> = ({ query }) => {
  const navigate = useNavigate();
  const { data: results, isLoading, error } = useGetSearchResults(query);
  const { t } = useTranslation();

  function formatDate(iso?: string) {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  }

  function formatDuration(sec?: number) {
    if (!sec || isNaN(sec)) return "0 min";
    return `${Math.round(sec / 60)} min`;
  }

  const apiPodcastToCardPodcast = (p: any): Podcast => {
    // Handle author - prefer p.author, fallback to p.authorId or p.author_id
    let author: User;
    if (p.author) {
      // Map author object from API response
      author = {
        id: p.author.id || p.author._id || "",
        name: p.author.name || p.author.username || "",
        username: p.author.username || "",
        profile_picture: (p.author as any).profilePicture || p.author.profile_picture || "",
        is_verified_writer: (p.author as any).isVerifiedWriter || p.author.is_verified_writer || false,
      };
    } else if (p.authorId) {
      // Use authorId if it's already a User object
      author = typeof p.authorId === 'object' 
        ? {
            id: p.authorId.id || p.authorId._id || "",
            name: p.authorId.name || p.authorId.username || "",
            username: p.authorId.username || "",
            profile_picture: (p.authorId as any).profilePicture || p.authorId.profile_picture || "",
            is_verified_writer: (p.authorId as any).isVerifiedWriter || p.authorId.is_verified_writer || false,
          }
        : { id: p.authorId as any, name: "", username: "", profile_picture: "", is_verified_writer: false };
    } else if (p.author_id) {
      // Handle author_id field - this is the structure from search results
      if (typeof p.author_id === 'object' && p.author_id !== null) {
        author = {
          id: p.author_id.id || p.author_id._id || "",
          name: p.author_id.name || p.author_id.username || "",
          username: p.author_id.username || "",
          email: p.author_id.email || "",
          profile_picture: (p.author_id as any).profilePicture || p.author_id.profile_picture || "",
          is_verified_writer: (p.author_id as any).isVerifiedWriter || p.author_id.is_verified_writer || false,
          is_email_verified: p.author_id.is_email_verified || false,
        };
      } else {
        author = { id: p.author_id as any, name: "", username: "", profile_picture: "", is_verified_writer: false };
      }
    } else {
      // Default fallback
      author = { id: "", name: "", username: "", profile_picture: "", is_verified_writer: false };
    }

    return {
      id: p.id || p._id || "",
      thumbnailUrl: p.thumbnailUrl || Pics.podcastimg,
      author: author,
      title: p.title || "Untitled Podcast",
      description: p.description || "",
      publishDate: formatDate(p.createdAt?.toString()),
      listenTime: formatDuration(p.audio?.duration),
      audioUrl: p.audio?.url || "",
      likes: p.likesCount || 0,
      comments: p.commentsCount ?? 0,
      isBookmarked: p.isBookmarked || false,
    };
  };

  const getFriendlyErrorMessage = (error: Error | { response?: { status: number }, message: string }, query?: string): string => {
    if (!error) return t("search.errors.default");
  
    if (error.message.includes("Network Error")) {
      return t("search.errors.network");
    }
    if ('response' in error && error.response) {
      const status = error.response.status;
      if (status === 404) {
        return t("search.errors.notFound", { query });
      }
      if (status === 500) {
        return t("search.errors.server");
      }
      if (status === 429) {
        return t("search.errors.rateLimit");
      }
    }
    return t("search.errors.default");
  };

  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="search-podcast">
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-podcast">
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear">
          <p className="text-neutral-50 text-center py-4">
            {getFriendlyErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  const rawPodcasts = results?.filter((item: any) => item.type === 'podcast') || [];
  
  // Transform the API data to match the Podcast interface
  const podcasts: Podcast[] = rawPodcasts.map(apiPodcastToCardPodcast);

  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  return (
    <div className="search-podcast">
      {podcasts && podcasts.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px] transition-all duration-300 ease-linear flex flex-col gap-7">
          {podcasts.map((podcast) => (
            <PodcastCard2 
              key={podcast.id} 
              podcast={podcast} 
              onReadMore={handlePodcastClick}
            />
          ))}
        </div>
      ) : (
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center py-4">
            {t('search.errors.noResult', { query })}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPodcast;