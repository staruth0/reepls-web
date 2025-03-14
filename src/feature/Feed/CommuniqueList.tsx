import React, { useEffect, useRef } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton'; // Added for better loading UI
import { useGetCommuniquerArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';

const CommuniqueList: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom

  // Fetch communiqué articles with infinite scrolling
  const { 
    data, 
    error, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useGetCommuniquerArticles();

  // Infinite scrolling logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Bottom reached, fetching next page!');
          fetchNextPage();
        }
      },
      {
        root: null, // Use viewport
        rootMargin: '100px', // Trigger 100px before bottom
        threshold: 0.5, // Trigger when 50% of bottomRef is visible
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3">
            <div>Communiques</div>
          </div>
        </Topbar>

        {/* Display Skeleton or Articles */}
        {isLoading ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7 pb-10">
            {data?.pages.map((page, i) => (
              <div className="flex flex-col" key={i}>
                {page.articles.map((article: Article) => (
                  <BlogPost
                    key={article._id}
                    isArticle={article.isArticle!}
                    media={article.media!}
                    title={article.title!}
                    content={article.content!}
                    user={article.author_id!}
                    date={article.createdAt!}
                    article_id={article._id!}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Show loading skeletons while fetching next page */}
        {isFetchingNextPage && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse mt-4">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        )}

        {/* Bottom trigger for infinite scroll */}
        <div ref={bottomRef} style={{ height: '100px' }} />

        {error && <div>Error: {error.message}</div>}
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default CommuniqueList;