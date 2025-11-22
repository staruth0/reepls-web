import React, {  useEffect, useRef } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { t } from 'i18next';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton';
import { useGetFollowedArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import ToggleFeed from './components/ToogleFeed';
import AuthorSuggestions from './components/AuthorSuggestions';
import './feed.scss';
import MainContent from '../../components/molecules/MainContent';


const FeedFollowing: React.FC = () => {
    // const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
    // const { toggleCognitiveMode } = useContext(CognitiveModeContext);
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom

  // Fetch followed articles with infinite scrolling
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFollowedArticles();

  // // Handle cognitive mode toggle
  // const handleBrainClick = () => {
  //   setIsBrainActive((prev) => !prev);
  //   toggleCognitiveMode();
  // };

  // Auto-fetch next page when scrolling to the bottom
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

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

 

  // Function to get friendly error messages
  const getFriendlyErrorMessage = (error: { 
    message?: string;
    response?: {
      status: number;
    };
  } | null) => {
    if (!error) return "Something went wrong. Please try again later.";

    // Handle common error cases
    if (error.message?.includes("Network Error")) {
      return "Oops! It looks like you're offline. Please check your internet connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return "No posts from the people you follow just yet. Check back later!";
      }
      if (status === 500) {
        return "Our servers are taking a quick nap. Please try again soon!";
      }
      if (status === 429) {
        return "Slow down a bit! Too many requests—give it a moment and try again.";
      }
    }

  
  };

  // Check if there are no articles
  const hasNoArticles = !isLoading && (!data || data.pages.every((page) => page.articles.length === 0));

  return (
    <MainContent>
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="lg:px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            {/* <CognitiveModeIndicator isActive={isBrainActive} onClick={handleBrainClick} /> */}
          </div>
        </Topbar>

        {/* Display Skeleton, No Articles Message, or Articles */}
        {isLoading ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        ) : hasNoArticles ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] text-neutral-50 py-4">
            <div className="text-center mb-6">
              <p className="text-[16px] font-roboto mb-4">
                {t("No posts and articles because you aren't following users. Follow authors to start seeing their work.")}
              </p>
              <h3 className="text-[18px] font-semibold mb-4 text-neutral-300">
                {t("REEPLS SUGGESTIONS")}
              </h3>
            </div>
            <AuthorSuggestions />
          </div>
        ) : (
            <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col items-center gap-7">
            {data?.pages.map((page, i) => (
              <div className="flex flex-col items-center gap-7" key={i}>
                {page.articles.map((article: Article) => (
                  <BlogPost key={article._id} article={article} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Show loading skeletons while fetching next page */}
        {isFetchingNextPage && (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7 py-6">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        )}

        {/* Bottom trigger for infinite scroll */}
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

export default FeedFollowing;