import React, { useState, useEffect } from 'react';
import { calculateReadingProgress } from '../../utils/readingProgressCalculator';
import ReadingProgressBar from '../atoms/ReadingProgressBar';

const ReadingProgressDemo: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState(50);
  const [scrollPosition, setScrollPosition] = useState(30);
  const [maxScrollPosition] = useState(60);
  const [weightMin, setWeightMin] = useState(0.7);
  const [isSimulating, setIsSimulating] = useState(false);

  const articleReadTime = 240; // 4 minutes

  const progress = calculateReadingProgress({
    timeSpent,
    articleReadTime,
    currentScrollPosition: scrollPosition,
    maxScrollPosition,
    weightMin
  });

  // Simulate reading progress
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (newTime >= articleReadTime) {
          setIsSimulating(false);
          return articleReadTime;
        }
        return newTime;
      });

      setScrollPosition(prev => {
        const newScroll = prev + 0.5;
        if (newScroll >= maxScrollPosition) {
          return maxScrollPosition;
        }
        return newScroll;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, articleReadTime, maxScrollPosition]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setTimeSpent(0);
    setScrollPosition(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-neutral-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Reading Progress Calculator Demo</h2>
      
      {/* Progress Display */}
      <div className="mb-6">
        <ReadingProgressBar 
          progress={progress} 
          showDetails={true}
          className="mb-4"
        />
        
        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
          <div>
            <strong>Time Ratio:</strong> {Math.round(progress.timeRatio * 100)}%
            <br />
            <span className="text-xs">({timeSpent}s / {articleReadTime}s)</span>
          </div>
          <div>
            <strong>Scroll Ratio:</strong> {Math.round(progress.scrollRatio * 100)}%
            <br />
            <span className="text-xs">({scrollPosition.toFixed(1)} / {maxScrollPosition})</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Time Spent (seconds): {timeSpent}
          </label>
          <input
            type="range"
            min="0"
            max={articleReadTime}
            value={timeSpent}
            onChange={(e) => setTimeSpent(Number(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Scroll Position: {scrollPosition.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max={maxScrollPosition}
            step="0.5"
            value={scrollPosition}
            onChange={(e) => setScrollPosition(Number(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Weight Min (α): {weightMin}
          </label>
          <input
            type="range"
            min="0.5"
            max="0.9"
            step="0.1"
            value={weightMin}
            onChange={(e) => setWeightMin(Number(e.target.value))}
            className="w-full"
            disabled={isSimulating}
          />
          <p className="text-xs text-neutral-400 mt-1">
            Higher values penalize skimming and lingering more
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded ${
              isSimulating 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-main-green hover:bg-green-600 text-white'
            }`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded bg-neutral-600 hover:bg-neutral-700 text-white"
            disabled={isSimulating}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Formula Display */}
      <div className="mt-6 p-4 bg-neutral-900 rounded text-sm text-neutral-300">
        <h3 className="font-bold mb-2">Formula:</h3>
        <p className="mb-2">RP = (α × min(Rt, Rs)) + ((1-α) × max(Rt, Rs))</p>
        <p className="text-xs text-neutral-400">
          Where α = {weightMin}, Rt = {progress.timeRatio.toFixed(3)}, Rs = {progress.scrollRatio.toFixed(3)}
        </p>
        <p className="text-xs text-neutral-400">
          Result: {progress.progress.toFixed(3)} = ({weightMin} × {Math.min(progress.timeRatio, progress.scrollRatio).toFixed(3)}) + ({(1-weightMin).toFixed(1)} × {Math.max(progress.timeRatio, progress.scrollRatio).toFixed(3)})
        </p>
      </div>
    </div>
  );
};

export default ReadingProgressDemo;
