import React, { useEffect } from "react";
import AuthorListItemNoCheckbox from "./AuthorListItemNoCheckBox";
import { useGetSuggestedPublications } from "../Hooks";
import { Publication } from "../../../models/datamodels";



const StreamSidebar: React.FC = () => {

  const { data: streams, isLoading, error } = useGetSuggestedPublications();

  useEffect(() => {
    console.log(' streams in sidebar', streams);
  }, [streams]);

  // Skeleton component for loading state
  const StreamSkeleton = () => (
    <div className="animate-pulse mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sticky top-0  bg-background hidden lg:block p-4 ">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200 dark:text-neutral-200">
            Streams Like This
          </h3>
          <div className="mb-6">
            {isLoading ? (
              // Show skeleton loading state
              Array.from({ length: 6 }).map((_, index) => (
                <StreamSkeleton key={index} />
              ))
            ) : error ? (
              // Show error state
              <div className="text-center py-8">
                <div className="text-red-400 mb-2">
                  <i className="fas fa-exclamation-triangle text-2xl"></i>
                </div>
                <p className="text-neutral-400 text-sm">Failed to load streams</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary-400 text-xs mt-2 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : streams?.data?.length === 0 ? (
              // Show empty state
              <div className="text-center py-8">
                <div className="text-neutral-500 mb-2">
                  <i className="fas fa-stream text-2xl"></i>
                </div>
                <p className="text-neutral-400 text-sm">No streams available</p>
              </div>
            ): (
              // Show actual streams
              streams?.data?.slice(0, 6).map((stream:Publication) => (
                <AuthorListItemNoCheckbox key={stream._id} author={stream} />
              ))
            )}
          </div>
        </div>

         <div className=" p-4 bg-gray-750 text-neutral-200">
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="flex items-center py-2 px-3  rounded-lg transition-all duration-200">
                            <i className="fas fa-users-cog mr-3"></i>
                            <span>Manage Authors</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center py-2 px-3 rounded-lg transition-all duration-200">
                            <i className="fas fa-trash-alt mr-3"></i>
                            <span>Delete Stream</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center py-2 px-3 rounded-lg transition-all duration-200">
                            <i className="fas fa-file-contract mr-3"></i>
                            <span>Terms and Policies</span>
                        </a>
                    </li>
                </ul>
            </div>
      </div>
    </div>
  );
};

export default StreamSidebar;
