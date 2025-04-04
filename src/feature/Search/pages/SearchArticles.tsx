import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetArticleResults } from '../hooks';

interface SearchArticlesProps {
  query: string;
}

const SearchArticles: React.FC<SearchArticlesProps> = ({ query }) => {
  const { data: articles, isLoading, error } = useGetArticleResults(query);

  useEffect(() => {
    console.log('article structure', articles);
  }, [articles]);

  return (
    <div className="search-articles">
      {isLoading ? (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
        </div>
      ) : error ? (
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear">
          <p className="text-red-500 text-center">Error: {error.message}</p>
        </div>
      ) : articles?.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px]  transition-all duration-300 ease-linear flex flex-col gap-7">
          {articles.map((article: Article) => (
            <BlogPost key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center">No articles available</p>
        </div>
      )}
    </div>
  );
};

export default SearchArticles;
