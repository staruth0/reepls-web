import React from 'react'

const ProfileRightSideSkeleton:React.FC = () => {
  return (
    <>
      
      <div className="p-4">
      
        <div className="h-7 w-1/3 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded mb-10"></div>

    
        <div className="flex flex-col gap-6">
      
          <div className="h-6 w-2/3 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
          <div className="h-6 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
          <div className="h-6 w-1/3 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded mb-4"></div>

        
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
            <div className="h-5 w-1/4 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
            <div className="h-5 w-1/4 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
          </div>

        
          <div className="flex justify-between items-center my-2">
            <div className="h-5 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
            <div className="h-6 w-12 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded-full"></div>
          </div>
          <div className="flex justify-between items-center my-2">
            <div className="h-5 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
            <div className="h-6 w-12 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded-full"></div>
          </div>
          <div className="flex justify-between items-center my-2">
            <div className="h-5 w-1/2 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
            <div className="h-6 w-12 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded-full"></div>
          </div>

        
          <div className="h-6 w-2/3 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded mt-6"></div>
          <div className="h-6 w-1/3 bg-neutral-500 dark:bg-neutral-600 animate-pulse rounded"></div>
        </div>
      </div>
    </>
    
  )
}

export default ProfileRightSideSkeleton
