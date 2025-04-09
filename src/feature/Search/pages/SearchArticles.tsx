import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetArticleResults } from '../hooks';
import { toast } from 'react-toastify'; // Added for toast notifications

interface SearchArticlesProps {
  query: string;
}

const SearchArticles: React.FC<SearchArticlesProps> = ({ query }) => {
  const { data: articles, isLoading, error } = useGetArticleResults(query);

  // Function to get friendly error messages specific to article search results
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong while searching for articles.";

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return "Oops! Looks like you’re offline. Check your connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return `No articles found for "${query}". Try a different search!`;
      }
      if (status === 500) {
        return "Our search engine is having a little trouble. Please try again soon!";
      }
      if (status === 429) {
        return "Too many searches! Give us a moment to catch up.";
      }
    }

    // Default fallback for unhandled errors
    return `Something unexpected happened while searching articles for "${query}".`;
  };

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  // Debug log
  useEffect(() => {
    console.log('article structure', articles);
  }, [articles]);

  // Loading state
  if (isLoading) {
    return (
      <div className="search-articles">
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
      <div className="search-articles">
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
    <div className="search-articles">
      {articles?.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px] transition-all duration-300 ease-linear flex flex-col gap-7">
          {articles.map((article: Article) => (
            <BlogPost key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center py-4">
            No articles found for "{query}". Try something else!
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchArticles;