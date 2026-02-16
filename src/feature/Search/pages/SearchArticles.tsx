import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useGetArticleResults } from '../hooks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getBackendErrorMessage } from '../../../utils/errorHandler';

interface SearchArticlesProps {
  query: string;
}

const SearchArticles: React.FC<SearchArticlesProps> = ({ query }) => {
  const { data: articles, isLoading, error } = useGetArticleResults(query);
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      const errorMessage = getBackendErrorMessage(error, t);
      toast.error(errorMessage);
    }
  }, [error, t]);

 

  // Loading state
  if (isLoading) {
    return (
      <div className="search-articles">
         <div className="flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
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
            {getBackendErrorMessage(error, t)}
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