import React from "react";

const AuthSuggestionSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-800 text-neutral-300 p-4 rounded-lg w-full flex items-center space-x-3 animate-pulse">
     
      <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
      <div className="flex-1">
       
        <div className="h-5 bg-neutral-700 rounded w-32 mb-1"></div>
       
        <div className="h-4 bg-neutral-700 rounded w-48"></div>
      </div>
    </div>
  );
};

export default AuthSuggestionSkeleton;