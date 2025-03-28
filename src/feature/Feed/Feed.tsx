import React, { useContext, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CognitiveModeIndicator from "../../components/atoms/CognitiveModeIndicator";
import Topbar from "../../components/atoms/Topbar/Topbar";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";
import { Article } from "../../models/datamodels";
import BlogPost from "../Blog/components/BlogPost";
import BlogSkeletonComponent from "../Blog/components/BlogSkeleton";
import { useGetAllArticles } from "../Blog/hooks/useArticleHook";
import Communique from "./components/Communique/Communique";
import ToggleFeed from "./components/ToogleFeed";
import "./feed.scss";
import { LuRefreshCw } from "react-icons/lu";

// Error Fallback Components
const FeedErrorFallback = ({
  error,
  // resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="p-4 flex flex-col items-center gap-4  text-red-600 rounded mx-4 mt-4">
    <p>Failed to load posts, {error.message}</p>
    <button
      onClick={() => window.location.reload()}
      // onClick={resetErrorBoundary}
      className="mt-2 px-3 py-1 bg-primary-400 rounded text-white hover:bg-primary-300 transition-colors flex items-center gap-1 "
    >
      <LuRefreshCw /> Retry
    </button>
  </div>
);

const PostErrorFallback = () => (
  <div className="p-3 bg-gray-100 text-gray-500 italic rounded my-2">
    Post could not be displayed
  </div>
);

const UserFeed: React.FC = () => {
  const { toggleCognitiveMode, isCognitiveMode } =
    useContext(CognitiveModeContext);
  const [isBrainActive, setIsBrainActive] = useState<boolean>(isCognitiveMode);
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

  // Handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  // Infinite scroll handler
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.5,
      }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            <div className="flex items-center gap-2">
              <CognitiveModeIndicator
                isActive={isBrainActive}
                onClick={handleBrainClick}
              />
            </div>
          </div>
        </Topbar>

        <ErrorBoundary FallbackComponent={FeedErrorFallback}>
          {/* Loading state */}
          {isLoading ? (
            <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
              <BlogSkeletonComponent />
              <BlogSkeletonComponent />
            </div>
          ) : (
            /* Feed content */
            <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7">
              {data?.pages.map((page, i) => (
                <div className="flex flex-col gap-7" key={`page-${i}`}>
                  {page.articles.map((article: Article) => (
                    <ErrorBoundary
                      key={article._id}
                      FallbackComponent={PostErrorFallback}
                    >
                      <BlogPost article={article} />
                    </ErrorBoundary>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* API error (not caught by boundary) */}
          {error && (
            <div className="p-4 flex flex-col items-center gap-4  text-red-600 rounded mx-4 mt-4">
              <p>Failed to load posts, {error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-primary-400 rounded text-white hover:bg-primary-300 transition-colors flex items-center gap-1 "
              >
                <LuRefreshCw /> Retry
              </button>
            </div>
          )}

          {/* Infinite scroll loading */}
          {isFetchingNextPage && (
            <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse mt-4">
              <BlogSkeletonComponent />
              <BlogSkeletonComponent />
            </div>
          )}
          <div ref={bottomRef} style={{ height: "100px" }} />
        </ErrorBoundary>
      </div>

      {/* Sidebar with its own boundary */}
      <ErrorBoundary FallbackComponent={FeedErrorFallback}>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default UserFeed;
