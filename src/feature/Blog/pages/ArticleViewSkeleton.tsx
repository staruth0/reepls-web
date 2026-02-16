import React from 'react';

const ArticleViewSkeleton: React.FC = () => {
  return (
    <div className="w-full mx-auto mt-6 flex flex-col justify-center items-start max-w-[750px]">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2 mb-4 md:hidden">
        <div className="animate-pulse h-4 w-4 rounded bg-neutral-600"></div>
        <div className="animate-pulse h-4 w-8 rounded bg-neutral-600"></div>
      </div>

      {/* Title skeleton */}
      <div className="w-full mb-3">
        <div className="animate-pulse h-8 w-4/5 rounded bg-neutral-600 mb-2"></div>
        <div className="animate-pulse h-6 w-3/5 rounded bg-neutral-600"></div>
      </div>

      {/* Subtitle skeleton */}
      <div className="w-full mb-4">
        <div className="animate-pulse h-5 w-2/3 rounded bg-neutral-600"></div>
      </div>

      {/* Thumbnail skeleton */}
      <div className="w-full my-4">
        <div className="animate-pulse h-64 w-full rounded-lg bg-neutral-600"></div>
      </div>

      {/* Author profile skeleton */}
      <div className="w-full flex my-3 items-center justify-between gap-3 mt-6 mb-3">
        <div className="flex gap-2">
          {/* Profile picture skeleton */}
          <div className="animate-pulse h-10 w-10 rounded-full bg-neutral-600"></div>
          <div className="flex flex-col gap-1">
            <div className="animate-pulse h-4 w-24 rounded bg-neutral-600"></div>
            <div className="animate-pulse h-3 w-32 rounded bg-neutral-600"></div>
          </div>
        </div>
        {/* Follow button skeleton */}
        <div className="animate-pulse h-8 w-20 rounded-full bg-neutral-600"></div>
      </div>

      {/* Meta info skeleton */}
      <div className="flex items-center gap-3 mb-3">
        <div className="animate-pulse h-3 w-16 rounded bg-neutral-600"></div>
        <div className="animate-pulse h-3 w-1 rounded-full bg-neutral-600"></div>
        <div className="animate-pulse h-3 w-20 rounded bg-neutral-600"></div>
      </div>

      {/* Audio controls skeleton */}
      <div className="w-full my-4">
        <div className="animate-pulse h-12 w-full rounded-lg bg-neutral-600"></div>
      </div>

      {/* Article content skeleton */}
      <div className="w-full mb-4 space-y-3">
        {/* Multiple paragraphs with varying widths */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`animate-pulse h-5 rounded bg-neutral-600 ${
              i === 0 ? 'w-full' : 
              i === 1 ? 'w-11/12' : 
              i === 2 ? 'w-10/12' : 
              i === 3 ? 'w-9/12' :
              i === 4 ? 'w-full' :
              i === 5 ? 'w-8/12' :
              i === 6 ? 'w-7/12' :
              'w-6/12'
            }`}
          ></div>
        ))}
      </div>

      {/* Article stats skeleton */}
      <div className="w-full mb-4">
        <div className="animate-pulse h-4 w-24 rounded bg-neutral-600"></div>
      </div>

      {/* Comments section skeleton */}
      <div className="w-full mx-auto mt-8">
        <div className="animate-pulse h-6 w-20 rounded bg-neutral-600 mb-3"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="animate-pulse h-8 w-8 rounded-full bg-neutral-600"></div>
              <div className="flex-1 space-y-2">
                <div className="animate-pulse h-4 w-24 rounded bg-neutral-600"></div>
                <div className="animate-pulse h-3 w-full rounded bg-neutral-600"></div>
                <div className="animate-pulse h-3 w-3/4 rounded bg-neutral-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleViewSkeleton;
