import React from "react";

const CommuniqueSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 text-neutral-300 p-4 rounded-lg w-full max-w-sm animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
        <div>
          <div className="h-4 bg-neutral-700 rounded w-32 mb-1"></div>
          <div className="h-3 bg-neutral-700 rounded w-24"></div>
        </div>
      </div>
      <div className="mt-2 h-3 bg-neutral-700 rounded w-20"></div>
      <div className="mt-4 h-4 bg-neutral-700 rounded w-full"></div>
      <div className="mt-4 h-4 bg-neutral-700 rounded w-full"></div>
    </div>
  );
};

export default CommuniqueSkeleton;