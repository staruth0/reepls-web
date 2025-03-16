import { Brain } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton';
import { useGetAllArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import ToggleFeed from './components/ToogleFeed';
import './feed.scss';

const UserFeed: React.FC = () => {
  const { toggleCognitiveMode,isCognitiveMode } = useContext(CognitiveModeContext);
  const [isBrainActive, setIsBrainActive] = useState<boolean>(isCognitiveMode);
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom

  // Fetch data
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllArticles();

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
        rootMargin: '100px', // Trigger when the bottomRef is 100px from the viewport edge
        threshold: 0.5, // Trigger when 50% of the bottomRef is visible
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

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center">
            <ToggleFeed />
            <Brain
              size={isBrainActive ? 35 : 30}
              onClick={handleBrainClick}
              className={`cursor-pointer transition-all ${
                isBrainActive
                  ? 'text-green-600 bg-green-100 rounded-full p-1'
                  : 'text-neutral-50 hover:text-green-600 hover:bg-green-100 hover:rounded-full hover:p-1 transition-all'
              }`}
            />
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
            {
              <>
                {/* Render all pages of articles */}
                {data?.pages.map((page, i) => (
                  <div className="flex flex-col" key={i}>
                    {page.articles.map((article: Article) => (
                      <BlogPost
                        key={article._id}
                        isArticle={article.isArticle!}
                        media={article.media!}
                        title={article.title!}
                        content={article.content!}
                        date={article.createdAt!}
                        article_id={article._id!}
                        user={article.author_id!}
                      />
                    ))}
                  </div>
                ))}
                {/* Loading indicator for next page */}
              </>
            }
          </div>
        )}
        {/* Bottom trigger point */}
        {isFetchingNextPage && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse mt-4">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        )}
        <div ref={bottomRef} style={{ height: '100px' }} />
        {error && <div>Error: {error.message}</div>}
      </div>

      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default UserFeed;
