import React from "react";

const RecentSearchesSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg w-full min-h-[500px] animate-pulse">
     
      <div className="h-8 bg-neutral-700 rounded mb-4"></div>

     
      <div className="space-y-2 min-h-[500px] h-full flex flex-col gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center justify-between">
          
            <div className="flex items-center space-x-1">
     
              <div className="size-8 bg-neutral-700 rounded"></div>
           
              <div className="h-8 bg-neutral-700 rounded w-44 lg:w-96"></div>
            </div>
           
            <div className="size-8 bg-neutral-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearchesSkeleton;