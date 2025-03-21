import React, { useEffect } from 'react';
import { useGetArticleResults } from '../hooks';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import BlogPost from '../../Blog/components/BlogPost';
import { Article } from '../../../models/datamodels';

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
        <div className="px-1 sm:px-8 transition-all duration-300 ease-linear flex flex-col gap-7">
          {articles.map((article: Article) => (
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
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear">
          <p className="text-neutral-500 text-center">No articles available</p>
        </div>
      )}
    </div>
  );
};

export default SearchArticles;