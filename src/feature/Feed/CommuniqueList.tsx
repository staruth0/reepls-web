import React, { useEffect, useRef } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import BlogSkeletonComponent from '../Blog/components/BlogSkeleton'; // Added for better loading UI
import { useGetCommuniquerArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';
import { commuLeft } from '../../assets/icons';
import { useTranslation } from 'react-i18next';

const CommuniqueList: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for the bottom
  const {t}= useTranslation()

  // Fetch communiqué articles with infinite scrolling
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetCommuniquerArticles();

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
          <div className="">
          <div className='flex gap-2'>
        <img className=' md:hidden' src={commuLeft} alt="star" />
        {/* <LuStar className="size-6 bg-main-yellow rounded-full p-1" strokeWidth={2.5} /> */}
      <div className='line-clamp-1'>{t(`Communiques`)}</div>
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
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col gap-7 pb-10">
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

      {/* Communique Section */}
      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default CommuniqueList;
