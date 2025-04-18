import React from 'react';
import { cn } from '../../../utils'; 


interface SkeletonBoxProps {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className }) => (
  <div className={cn('bg-neutral-700 animate-pulse rounded', className)} />
);

// PostArticleAnalyticsSkeleton component
const PostArticleAnalyticsSkeleton: React.FC = () => {
  return (
    <div className="lg:grid">
      {/* Main Content Section */}
      <div className="flex flex-col lg:border-r-[1px] border-neutral-500 min-h-screen">
        {/* Topbar Skeleton */}
        <div className="h-14 bg-neutral-800 flex items-center px-5">
          <SkeletonBox className="h-6 w-32" />
        </div>

        {/* Analytics Content */}
        <div className="px-5 md:px-10 lg:px-20 py-8">
          {/* Article Title Section with Image */}
          <div className="mb-8">
            <div className="lg:flex lg:gap-8">
              {/* Image Skeleton */}
              <SkeletonBox className="w-full lg:w-[40%] h-64 md:h-80 rounded-lg" />
              
              {/* Text Content Skeleton */}
              <div className="mt-4 lg:mt-0 lg:flex lg:flex-col lg:justify-between lg:w-[60%]">
                <div>
                  <SkeletonBox className="h-7 w-3/4 mb-2" />
                  <SkeletonBox className="h-4 w-full mb-1" />
                  <SkeletonBox className="h-4 w-5/6 mb-1" />
                  <SkeletonBox className="h-4 w-4/5" />
                </div>
                <SkeletonBox className="h-4 w-24 mt-4" />
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-neutral-800 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <SkeletonBox className="h-5 w-5" />
                  <SkeletonBox className="h-4 w-20" />
                </div>
                <SkeletonBox className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostArticleAnalyticsSkeleton;