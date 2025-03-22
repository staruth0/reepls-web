import React from "react";

const TrendingTopicsSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 text-neutral-300 p-4 rounded-lg w-full animate-pulse">
      {/* First Row */}
      <div className="flex flex-wrap gap-3 mb-2">
        <div className="h-5 bg-neutral-700 rounded w-24"></div>
        <div className="h-5 bg-neutral-700 rounded w-40"></div>
      </div>
      {/* Second Row */}
      <div className="flex flex-wrap gap-3 mb-2">
        <div className="h-5 bg-neutral-700 rounded w-28"></div>
        <div className="h-5 bg-neutral-700 rounded w-20"></div>
        <div className="h-5 bg-neutral-700 rounded w-32"></div>
        <div className="h-5 bg-neutral-700 rounded w-16"></div>
      </div>
      {/* Third Row */}
      <div className="flex flex-wrap gap-3">
        <div className="h-5 bg-neutral-700 rounded w-20"></div>
      
        <div className="h-5 bg-neutral-700 rounded w-28"></div>
        <div className="h-5 bg-neutral-700 rounded w-20"></div>
      </div>
    </div>
  );
};

export default TrendingTopicsSkeleton;