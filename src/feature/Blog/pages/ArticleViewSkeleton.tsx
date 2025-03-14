import React from 'react';

const ArticleViewSkeleton: React.FC = () => {
  return (
    <div className="w-full md:max-w-4xl mx-auto mt-10 flex flex-col justify-center items-center px-4">
      <div className="animate-pulse h-8 w-80 rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 mb-6"></div>
      <div className="animate-pulse h-12 w-full rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 mb-4"></div>
      <div className="animate-pulse h-8 w-3/4 rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 mb-6"></div>
      <div className="w-full space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`animate-pulse h-5 rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 ${i === 0 ? 'w-full' : i === 1 ? 'w-11/12' : i === 2 ? 'w-10/12' : 'w-9/12'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ArticleViewSkeleton;
