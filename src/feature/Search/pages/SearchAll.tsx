import React, { useEffect } from 'react';
import { useGetSearchResults } from '../hooks';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import BlogPost from '../../Blog/components/BlogPost';
import { Article } from '../../../models/datamodels';

interface SearchAllProps {
  query: string;
}

const SearchAll: React.FC<SearchAllProps> = ({ query }) => {
  const { data: results, isLoading, error } = useGetSearchResults(query);

  useEffect(() => {
    console.log('combined results structure', results);
  }, [results]);

  return (
    <div className="search-all">
      {isLoading ? (
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
        </div>
      ) : error ? (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear">
          <p className="text-red-500 text-center">Error: {error.message}</p>
        </div>
      ) : results?.length > 0 ? (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear flex flex-col gap-7">
          {results.map((item: Article) => (
            <BlogPost
              key={item._id}
              isArticle={item.isArticle!}
              media={item.media!}
              title={item.title!}
              content={item.content!}
              date={item.createdAt!}
              article_id={item._id!}
              user={item.author_id!}
              slug={item.slug || ''}
            />
          ))}
        </div>
      ) : (
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center">No results available</p>
        </div>
      )}
    </div>
  );
};

export default SearchAll;