import React, { useEffect } from 'react'
import { useGetSavedReposts } from '../../Repost/hooks/useRepost'; // Assuming this path is correct
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { Article } from '../../../models/datamodels';

const SavedRepostsContainer:React.FC = () => {
  const { data, isLoading, error } = useGetSavedReposts();

  useEffect(() => {
    if (data) {
      console.log("Saved Reposts data:", data);
    }
  }, [data]);

  return (
    <div className="min-h-screen ">
      {/* Display Skeleton or Reposts */}
      {isLoading ? (
        <div className="px-1 w-full transition-all duration-300 ease-linear flex flex-col-reverse">
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
          <BlogSkeletonComponent />
        </div>
      ) : (
        <div className="  w-full transition-all duration-300 ease-linear flex flex-col items-center gap-7">
          {data?.reposts && data.reposts.length > 0 ? (
            data.reposts.map((repost:Article) => (
              <BlogPost key={repost._id} article={repost} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--neutral-300)] text-lg">No saved reposts found</p>
              <p className="text-[var(--neutral-400)] text-sm mt-2">Save articles to see them here!</p>
            </div>
          )}
        </div>
      )}

      {/* Friendly error display */}
      {error && (
        <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] text-neutral-50 text-center py-4">
          <p>Something went wrong. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default SavedRepostsContainer;