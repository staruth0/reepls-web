import React from "react";

const BlogSkeletonComponent: React.FC = () => {
  return (
    <div className="mt-5 border-[1px] border-neutral-500 p-2 md:p-4 max-w-2xl bg-background rounded-3xl animate-pulse">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-neutral-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-neutral-700 rounded w-20"></div>
        </div>
      </div>

      {/* Content/Image Area */}
      <div className="mb-4">
        <div className="w-full h-[400px] bg-neutral-700 rounded-lg"></div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 px-2">
        <div className="w-6 h-6 bg-neutral-700 rounded"></div>
        <div className="w-6 h-6 bg-neutral-700 rounded"></div>
        <div className="w-6 h-6 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );
};

export default BlogSkeletonComponent;