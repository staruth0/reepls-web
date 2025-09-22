import React from "react";

const ArticleSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 text-neutral-300 px-2 md:p-4 rounded-lg lg:min-w-[600px] w-full min-h-[300px] mt-7 flex flex-col justify-between animate-pulse">
      <div className="flex items-center md:space-x-3">
        <div className="w-10 h-10 bg-neutral-700 rounded-full"></div>
        <div>
          <div className="h-4 bg-neutral-700 rounded w-32 mb-1"></div>
          <div className="h-3 bg-neutral-700 rounded w-24"></div>
        </div>
      </div>
      <div>
        <div className="mt-4 h-5 bg-neutral-700 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-neutral-700 rounded w-full"></div>
        <div className="mt-2 h-4 bg-neutral-700 rounded w-5/6"></div>
        <div className="mt-2 h-4 bg-neutral-700 rounded w-2/3"></div>
      </div>

      <div className="mt-4 flex justify-between w-full">
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
      </div>
      <div className="mt-4 flex justify-between w-full">
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
        <div className="h-9 bg-neutral-700 rounded w-32"></div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
