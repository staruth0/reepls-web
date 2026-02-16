import React from 'react';
import { ReadingProgressResult } from '../../utils/readingProgressCalculator';

interface ReadingProgressBarProps {
  progress: ReadingProgressResult;
  showDetails?: boolean;
  className?: string;
}

const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
  showDetails = false,
  className = ''
}) => {
  const { progressPercentage, timeRatio, scrollRatio, isTimeLimited, isScrollLimited } = progress;

  return (
    <div className={`reading-progress-bar ${className}`}>
      {/* Main progress bar */}
      <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
        <div
          className="bg-main-green h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center text-sm text-neutral-400">
        <span className="font-medium">
          {progressPercentage}% complete
          {(isTimeLimited || isScrollLimited) && (
            <span className="ml-1 text-xs">
              {isTimeLimited && isScrollLimited ? ' (fully read)' : 
               isTimeLimited ? ' (time limit reached)' : 
               ' (scrolled to end)'}
            </span>
          )}
        </span>
        
        {showDetails && (
          <div className="flex gap-4 text-xs">
            <span>Time: {Math.round(timeRatio * 100)}%</span>
            <span>Scroll: {Math.round(scrollRatio * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingProgressBar;
