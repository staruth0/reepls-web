import React from "react";

const RecentSearchesSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg w-full min-h-[500px] animate-pulse">
      {/* Title Placeholder */}
      <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded  mb-4"></div>

      {/* List Items Placeholder */}
      <div className="space-y-2 min-h-[500px] h-full flex flex-col gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center justify-between ">
            {/* Arrow and Text Placeholder */}
            <div className="flex items-center space-x-1">
              {/* Arrow Placeholder */}
              <div className="size-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              {/* Text Placeholder */}
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-96"></div>
            </div>
            {/* Magnifying Glass Icon Placeholder */}
            <div className="size-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearchesSkeleton;