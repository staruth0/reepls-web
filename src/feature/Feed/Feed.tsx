import React, { useEffect, useRef } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton';
import { useGetAllArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import ToggleFeed from './components/ToogleFeed';

import MainContent from '../../components/molecules/MainContent';



const UserFeed: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllArticles();

  // Removed console.log for production performance

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '800px',
        threshold: 0.5,
      }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Function to get friendly error messages
  const getFriendlyErrorMessage = (
    error:
      | Error
      | { response?: { status: number }; message?: string }
      | null
  ): string => {
    if (!error) return 'Something went wrong. Please try again later.';

    if (error.message?.includes('Network Error')) {
      return "Oops! It looks like you're offline. Please check your internet connection and try again.";
    }
    if ('response' in error && error.response) {
      const status = error.response.status;
      if (status === 404) {
        return 'We couldn’t find any posts right now. They might be hiding!';
      }
      if (status === 500) {
        return 'Our servers are having a little hiccup. Please hang tight and try again soon.';
      }
      if (status === 429) {
        return 'Whoa, slow down! Too many requests. Give it a moment and try again.';
      }
    }

    return 'Something unexpected happened. We’re working on it—please try again later!';
  };

  return (
    <MainContent>
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <div className="lg:px-3 flex justify-between items-center w-full">
              <ToggleFeed />
            </div>
          </Topbar>

        {/* Display Skeleton or Articles */}
        {isLoading ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col  gap-7 py-6">
            {data?.pages?.map((page, i) => {
              const articles = Array.isArray(page?.articles) ? page.articles : [];
              return (
                <div className=" self-center flex flex-col items-center gap-2" key={i}>
                  {articles.map((article: Article) => (           
                    <BlogPost key={article._id} article={article} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7 py-6">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        )}
        <div ref={bottomRef} style={{ height: '100px' }} />
        {/* Friendly error display */}
        {error && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] text-neutral-50 text-center py-4">
            {getFriendlyErrorMessage(error)}
          </div>
        )}
      </div>

        <div className="communique bg-background hidden lg:block">
          <Communique />
        </div>
      </div>
    </MainContent>
  );
};

export default UserFeed;
