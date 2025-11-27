import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article, User } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useGetSearchResults } from '../hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import AuthorComponent from '../../Saved/Components/AuthorComponent';
import PodcastCard2 from '../../Podcast/components/PodcastLayout2';
import { Pics } from '../../../assets/images';

interface SearchAllProps {
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

interface SearchResultItem {
  type: 'article' | 'user' | 'podcast';
  data: Article | User | Podcast;
}

const SearchAll: React.FC<SearchAllProps> = ({ query }) => {
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

  // Function to get friendly error messages specific to search results
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

  console.log('results', results);

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);



  // Function to determine the type of each result
  const getResultType = (item: any): SearchResultItem => {
    if (item.type === 'user') {
      return { type: 'user', data: item as User };
    } else if (item.type === 'podcast') {
      // Transform podcast data to match Podcast interface
      const podcast = apiPodcastToCardPodcast(item);
      return { type: 'podcast', data: podcast };
    } else {
      // Treat both articles and posts the same way
      return { type: 'article', data: item as Article };
    }
  };

  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="search-all">
           <div className="flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                 </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="search-all">
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear">
          <p className="text-neutral-50 text-center py-4">
            {getFriendlyErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  // Success or empty state
  return (
    <div className="search-all">
      {(results?.length || 0) > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px] transition-all duration-300 ease-linear flex flex-col gap-7">
          {(results || []).map((item: any, index: number) => {
            const result = getResultType(item);
            
            if (result.type === 'user') {
              const user = result.data as User;
              return (
                <AuthorComponent
                  key={`${user._id || user.id || index}-${index}`}
                  username={user.username || ''}
                />
              );
            } else if (result.type === 'podcast') {
              const podcast = result.data as Podcast;
              return (
                <PodcastCard2
                  key={podcast.id || index}
                  podcast={podcast}
                  onReadMore={handlePodcastClick}
                />
              );
            } else {
              const article = result.data as Article;
              return <BlogPost key={article._id || article.id || index} article={article} />;
            }
          })}
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

export default SearchAll;