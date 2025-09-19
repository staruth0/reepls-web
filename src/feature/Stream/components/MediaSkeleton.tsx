import React from "react";

const MediaSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {/* Generate 6 skeleton items */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="relative group">
          <div className="relative p-2 md:p-0 overflow-hidden rounded-lg shadow-md">
            <div className="w-full h-64 bg-neutral-700 rounded-lg"></div>
            <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center">
              <div className="opacity-0 text-white text-center p-4">
                <div className="h-4 bg-neutral-600 rounded w-24 mb-2"></div>
                <div className="h-3 bg-neutral-600 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaSkeleton;
