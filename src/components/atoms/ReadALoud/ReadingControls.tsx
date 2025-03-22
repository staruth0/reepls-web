import { Loader2, PauseCircle, PlayCircle, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Article } from '../../../models/datamodels';

export const ReadAloud = ({ article }: { article: Article }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const handleSpeak = () => {
    setIsGenerating(true);
    setIsReading(true);
    setIsPaused(false);
    setIsStopped(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const cancelSpeaking = () => {
    setIsReading(false);
    setIsPaused(false);
    setIsStopped(true);
  };

  const getReadingStatusText = () => {
    if (isGenerating) return 'Generating...';
    if (isReading) return 'Reading...';
    if (isPaused) return 'Paused';
    if (isStopped) return 'Stopped';
    return 'Read Aloud';
  };

  return (
    <div className="flex justify-end my-4 gap-2">
      <button
        onClick={isReading ? cancelSpeaking : handleSpeak}
        className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
        {isGenerating ? (
          <Loader2 className="size-5 animate-spin" />
        ) : isReading ? (
          <Volume2 className="size-5 text-neutral-500" />
        ) : (
          <Volume2 className="size-5 text-neutral-500" />
        )}
        {getReadingStatusText()}
      </button>
      {isReading && (
        <button onClick={handlePauseResume} className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
          {isPaused ? (
            <PlayCircle className="size-5 text-neutral-500" />
          ) : (
            <PauseCircle className="size-5 text-neutral-500" />
          )}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
    </div>
  );
};
