import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { LuMenu } from 'react-icons/lu';

// Skeleton component for individual elements
const SkeletonBox: React.FC<{ 
  className?: string; 
  children?: React.ReactNode;
}> = ({ className = "", children }) => (
  <div className={`bg-neutral-700 animate-pulse ${className}`}>
    {children}
  </div>
);

const PodcastDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative bg-background text-neutral-50">
      <Topbar>
        <div className="w-full flex justify-between items-center py-4 px-4">
          <span className="font-semibold text-lg">Podcast</span>
          <LuMenu size={24} className="hidden md:block" />
        </div>
      </Topbar>

      <div className="max-w-[750px] w-full mx-auto px-4 mb-56 flex-grow py-8 flex flex-col gap-2">
        {/* Author Info Skeleton */}
        <div className="w-full flex my-4 items-center justify-between gap-4 mt-8 mb-4">
          <div className="flex gap-2">
            {/* Avatar skeleton */}
            <SkeletonBox className="rounded-full w-10 h-10"></SkeletonBox>
            <div className="space-y-2">
              {/* Author name skeleton */}
              <SkeletonBox className="h-4 w-32 rounded"></SkeletonBox>
              {/* Bio skeleton */}
              <SkeletonBox className="h-3 w-48 rounded"></SkeletonBox>
              {/* Date skeleton */}
              <SkeletonBox className="h-3 w-24 rounded"></SkeletonBox>
            </div>
          </div>
          {/* Follow button skeleton */}
          <SkeletonBox className="h-8 w-20 rounded-full"></SkeletonBox>
        </div>

        {/* Title Skeleton */}
        <div className="mt-4 mb-2">
          <SkeletonBox className="h-8 w-full rounded mb-2"></SkeletonBox>
          <SkeletonBox className="h-8 w-3/4 rounded"></SkeletonBox>
        </div>

        {/* Thumbnail Skeleton */}
        <div className="my-6 w-full max-w-full mx-auto">
          <SkeletonBox className="w-full h-64 rounded-lg"></SkeletonBox>
        </div>

        {/* Audio Player Skeleton */}
        <div className="flex items-center gap-4 my-6 p-4 bg-neutral-800 rounded-lg">
          {/* Play button skeleton */}
          <SkeletonBox className="w-12 h-12 rounded-full flex-shrink-0"></SkeletonBox>
          
          {/* Audio wave skeleton */}
          <div className="flex-grow w-full">
            <SkeletonBox className="h-8 rounded"></SkeletonBox>
          </div>
          
          {/* Duration skeleton */}
          <SkeletonBox className="w-12 h-4 rounded"></SkeletonBox>
        </div>

        {/* Description Skeleton */}
        <div className="w-full mb-5 text-lg leading-relaxed">
          <SkeletonBox className="h-6 w-32 rounded mb-2"></SkeletonBox>
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-full rounded"></SkeletonBox>
            <SkeletonBox className="h-4 w-full rounded"></SkeletonBox>
            <SkeletonBox className="h-4 w-3/4 rounded"></SkeletonBox>
            <SkeletonBox className="h-4 w-5/6 rounded"></SkeletonBox>
          </div>
        </div>
      </div>

      {/* Floating Toolbar Skeleton */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-8 h-8 rounded-full"></SkeletonBox>
          <SkeletonBox className="w-6 h-4 rounded"></SkeletonBox>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-8 h-8 rounded-full"></SkeletonBox>
          <SkeletonBox className="w-6 h-4 rounded"></SkeletonBox>
        </div>
        <SkeletonBox className="w-8 h-8 rounded-full"></SkeletonBox>
        <SkeletonBox className="w-8 h-8 rounded-full"></SkeletonBox>
      </div>
    </div>
  );
};

export default PodcastDetailSkeleton;
