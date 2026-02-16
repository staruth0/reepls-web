import React, { useContext, useEffect, useRef, useState } from 'react';
import CognitiveModeIndicator from '../../components/atoms/CognitiveModeIndicator';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton';
import { useGetFollowedArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import ToggleFeed from './components/ToogleFeed';
import './feed.scss';

const PopularTopicsPage: React.FC = () => {
  const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
  const { toggleCognitiveMode } = useContext(CognitiveModeContext);
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom

  // Fetch followed articles with infinite scrolling
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFollowedArticles();

  // Handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  // Infinite scrolling logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            <CognitiveModeIndicator isActive={isBrainActive} onClick={handleBrainClick} />
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
              <div className="flex flex-col" key={i}>
                {page.articles.map((article: Article) => (
                  <BlogPost key={article._id} article={article} />
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

      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default PopularTopicsPage;
