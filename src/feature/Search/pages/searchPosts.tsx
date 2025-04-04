import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetPostResults } from '../hooks';

interface SearchPostsProps {
  query: string;
}

const SearchPosts: React.FC<SearchPostsProps> = ({ query }) => {
  const { data: posts, isLoading, error } = useGetPostResults(query);

  useEffect(() => {
    console.log('post structure', posts);
  }, [posts]);

  return (
    <div className="search-posts">
      {isLoading ? (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
        </div>
      ) : error ? (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear">
          <p className="text-red-500 text-center">Error: {error.message}</p>
        </div>
      ) : posts?.length > 0 ? (
        <div className="px-1 sm:px-8 max-w-[680px]   transition-all duration-300 ease-linear flex flex-col gap-7">
          {posts.map((article: Article) => (
            <BlogPost key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center">No posts available</p>
        </div>
      )}
    </div>
  );
};

export default SearchPosts;
