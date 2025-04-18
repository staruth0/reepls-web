// src/components/skeletons/ProfileMediaSkeleton.tsx
import React from 'react';
import { cn } from '../../../utils';


interface SkeletonBoxProps {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className }) => (
  <div className={cn('bg-neutral-700 animate-pulse rounded', className)} />
);

const ProfileMediaSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBox key={index} className="aspect-square w-full rounded-lg" />
      ))}
    </div>
  );
};

export default ProfileMediaSkeleton;