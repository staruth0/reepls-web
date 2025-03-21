import React, { useEffect } from 'react';
import { useGetPostResults } from '../hooks';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import BlogPost from '../../Blog/components/BlogPost';
import { Article } from '../../../models/datamodels';



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
        <div className="px-1 sm:px-8  transition-all duration-300 ease-linear flex flex-col gap-7">
          {posts.map((article: Article) => (
            <BlogPost
            key={article._id}
            isArticle={article.isArticle!}
            media={article.media!}
            title={article.title!}
            content={article.content!}
            date={article.createdAt!}
            article_id={article._id!}
            user={article.author_id!}
            slug={article.slug || ''}
            />
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