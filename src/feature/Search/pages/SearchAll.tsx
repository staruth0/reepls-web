import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetSearchResults } from '../hooks';
import { toast } from 'react-toastify'; // Added for toast notifications
import { useTranslation } from 'react-i18next';

interface SearchAllProps {
  query: string;
}

const SearchAll: React.FC<SearchAllProps> = ({ query }) => {
  const { data: results, isLoading, error } = useGetSearchResults(query);

  const {t} = useTranslation()

  // Function to get friendly error messages specific to search results
  const getFriendlyErrorMessage = (error: any, query?: string): string => {
    if (!error) return t("search.errors.default");
  
    if (error.message.includes("Network Error")) {
      return t("search.errors.network");
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return t("search.errors.notFound", { query }); // Dynamic query
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

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  // Debug log
  useEffect(() => {
    console.log('combined results structure', results);
  }, [results]);

  // Loading state
  if (isLoading) {
    return (
      <div className="search-all">
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
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
      {results?.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px] transition-all duration-300 ease-linear flex flex-col gap-7">
          {results.map((item: Article) => (
            <BlogPost key={item._id} article={item} />
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

export default SearchAll;