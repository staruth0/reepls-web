import React, { useEffect } from 'react';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetSearchResults } from '../hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PodcastCard2 from '../../Podcast/components/PodcastLayout2';

interface SearchPodcastProps {
  query: string;
}

const SearchPodcast: React.FC<SearchPodcastProps> = ({ query }) => {
  const { data: results, isLoading, error } = useGetSearchResults(query);
  const { t } = useTranslation();

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

  const podcasts = results?.filter((item: any) => item.type === 'podcast') ;

  return (
    <div className="search-podcast">
      {podcasts && podcasts.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px] transition-all duration-300 ease-linear flex flex-col gap-7">
          {podcasts.map((podcast: any) => (
            <PodcastCard2 key={podcast._id} podcast={podcast} />
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