import React from "react";

const BlogSkeletonComponent: React.FC = () => {
  return (
    <div className="mt-5 border border-neutral-300 p-4 md:p-6 max-w-2xl bg-white rounded-2xl shadow-sm">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-neutral-200 rounded w-32"></div>
          <div className="h-2.5 bg-neutral-200 rounded w-24"></div>
        </div>
      </div>

      {/* Content/Image Area */}
      <div className="mb-4">
        <div className="w-full h-[400px] bg-neutral-200 rounded-lg"></div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 px-2">
        <div className="w-6 h-6 bg-neutral-200 rounded"></div>
        <div className="w-6 h-6 bg-neutral-200 rounded"></div>
        <div className="w-6 h-6 bg-neutral-200 rounded"></div>
      </div>
    </div>
  );
};

export default BlogSkeletonComponent;