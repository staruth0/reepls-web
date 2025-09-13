import React from 'react';

const StreamDetailsSkeleton: React.FC = () => {
  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      {/* Main content skeleton */}
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        {/* Topbar skeleton */}
        <div className="bg-background border-b border-neutral-500 px-4 py-3">
          <div className="h-6 bg-neutral-700 rounded w-32 animate-pulse"></div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* StreamHeader skeleton */}
          <div className="relative w-full">
            {/* Banner skeleton */}
            <div className="relative w-full h-32 bg-neutral-700 animate-pulse"></div>
            {/* Profile picture skeleton */}
        
            {/* Stream details skeleton */}
            <div className="py-4 px-1">
              <div className="flex items-baseline">
                <div className="h-6 bg-neutral-700 rounded w-48 animate-pulse"></div>
                <div className="ml-4 h-4 bg-neutral-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="mt-2 h-4 bg-neutral-700 rounded w-full animate-pulse"></div>
              <div className="mt-2 h-4 bg-neutral-700 rounded w-3/4 animate-pulse"></div>
              {/* Additional info skeleton */}
              <div className="flex items-center mt-4 space-x-4">
                <div className="h-4 bg-neutral-700 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-neutral-700 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="border-b border-neutral-500">
            <div className="flex space-x-8">
              {['About', 'Article', 'Media', 'Authors'].map((_, index) => (
                <div
                  key={index}
                  className="h-8 bg-neutral-700 rounded w-16 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Tab content skeleton */}
          <div className="mt-6 space-y-4">
            <div className="h-4 bg-neutral-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-neutral-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-neutral-700 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-neutral-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="communique sidebar bg-background hidden lg:block">
        <div className="p-4 space-y-4">
          <div className="h-6 bg-neutral-700 rounded w-24 animate-pulse"></div>
          <div className="space-y-5">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neutral-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-neutral-700 rounded w-1/2 mt-1 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamDetailsSkeleton;
