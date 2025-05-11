import React, { useContext, useEffect, useRef, useState } from 'react';
import CognitiveModeIndicator from '../../components/atoms/CognitiveModeIndicator';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton';
import { useGetRecommendedArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import ToggleFeed from './components/ToogleFeed';
import './feed.scss';
import { LuLoader } from 'react-icons/lu';


const UserFeed: React.FC = () => {
  const { toggleCognitiveMode, isCognitiveMode } = useContext(CognitiveModeContext);
  const [isBrainActive, setIsBrainActive] = useState<boolean>(isCognitiveMode);
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom

  // Fetch data
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetRecommendedArticles();


  // Handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  // Auto-fetch next page when scrolling to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Bottom reached, fetching next page!'); // Debug log
          fetchNextPage();
        }
      },
      {
        root: null, // Use the viewport as the scroll container
        rootMargin: '800px', // Trigger when 800px from the viewport edge
        threshold: 0.5, // Trigger when 50% of the bottomRef is visible
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current); // Note: Should be bottomRef.current, fixed below
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current); // Note: Should be bottomRef.current, fixed below
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    console.log('dataArticles', data);
  }, [data]);

  // Function to get friendly error messages
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong. Please try again later.";

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return "Oops! It looks like you're offline. Please check your internet connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return "We couldn’t find any posts right now. They might be hiding!";
      }
      if (status === 500) {
        return "Our servers are having a little hiccup. Please hang tight and try again soon.";
      }
      if (status === 429) {
        return "Whoa, slow down! Too many requests. Give it a moment and try again.";
      }
    }

    // Default fallback for unhandled errors
    return "Something unexpected happened. We’re working on it—please try again later!";
  };

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            <div className="flex items-center gap-2">
              <CognitiveModeIndicator isActive={isBrainActive} onClick={handleBrainClick} />
            </div>
          </div>
        </Topbar>

        {/* Display Skeleton or Articles */}
        {isLoading ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7">
            {data?.pages.map((page, i) => (
              <div className="flex flex-col gap-7" key={i}>
                {page.articles.map((article: Article) => (
                
                  <BlogPost key={article._id} article={article} />
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse mt-8">
            <LuLoader className="animate-spin text-primary-400 self-center size-10 inline-block mx-4" />
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
  );
};

export default UserFeed;