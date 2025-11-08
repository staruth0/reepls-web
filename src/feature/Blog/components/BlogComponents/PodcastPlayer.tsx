import React, { useMemo, useCallback } from 'react';
import { Play, Pause, Radio } from 'lucide-react';
import { useAudioControls } from '../../../../hooks/useMediaPlayer';
import { useAudioPlayer } from '../../../../hooks/useAudioplayer';
import { useGetPodcastById } from '../../../Podcast/hooks';

interface PodcastPlayerProps {
  podcastId?: string;
  articleId?: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcastId }) => {
  // Fetch podcast data
  const { data: podcastData } = useGetPodcastById(podcastId || "");
  const podcast = podcastData?.data;

  // Audio controls for the podcast
  const { 
    isPlaying, 
    togglePlay, 
    currentTrack 
  } = useAudioControls(podcast ? {
    id: podcast.id,
    title: podcast.title,
    url: podcast.audio.url,
    thumbnail: podcast.thumbnailUrl,
    author: podcast.author?.name,
  } : undefined);

  // Get real-time progress from audio player
  const { progress, duration } = useAudioPlayer();

  const handlePodcastPlay = () => {
    if (!podcast) return;
    togglePlay();
  };

  // Format duration helper function
  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Get current progress and duration for this specific podcast
  const isCurrentPodcast = podcast && currentTrack?.id === podcast?.id;
  const currentProgress = isCurrentPodcast ? progress : 0;
  const currentDuration = isCurrentPodcast && duration > 0 ? duration : (podcast?.audio?.duration || 0);
  
  // Calculate podcast progress percentage
  const podcastProgressPercentage = currentDuration > 0 ? (currentProgress / currentDuration) * 100 : 0;

  // Memoized current time and duration displays
  const memoizedCurrentTime = useMemo(() => 
    formatDuration(currentProgress),
    [currentProgress, formatDuration]
  );

  const memoizedPodcastDuration = useMemo(() => 
    formatDuration(currentDuration),
    [currentDuration, formatDuration]
  );

  if (!podcast) return null;

  return (
    <div className="w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] mx-auto mb-2 sm:mb-2.5 md:mb-3 p-[2%] sm:p-[2.5%] md:p-[3%] bg-primary-400 rounded-lg sm:rounded-xl">
      <div className="flex items-center gap-[1.5%] sm:gap-[2%] md:gap-[2.5%] w-full">
        {/* Podcast Icon/Thumbnail */}
        <div className="w-[9%] sm:w-[8.5%] md:w-[8%] aspect-square rounded-md sm:rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
          {podcast.thumbnailUrl ? (
            <img 
              src={podcast.thumbnailUrl} 
              alt={podcast.title}
              className="w-full h-full rounded-md sm:rounded-lg object-cover"
            />
          ) : (
            <Radio className="w-[50%] h-[50%] text-white" />
          )}
        </div>

        {/* Podcast Info */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ width: 'calc(100% - 9% - 9% - 1.5%)' }}>
          <div className="mb-[1%] sm:mb-[1.5%] md:mb-[2%]">
            <h3 className="text-white font-bold text-sm line-clamp-1 text-ellipsis overflow-hidden">
              {podcast.title}
            </h3>
            {podcast.description && (
              <p className="text-white/90 text-xs line-clamp-1 text-ellipsis overflow-hidden">
                {podcast.description}
              </p>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-[0.8%] sm:gap-[1%] md:gap-[1.5%] w-full">
            <span className="text-white text-[clamp(0.5rem,1.3vw,0.65rem)] font-medium whitespace-nowrap flex-shrink-0">
              {memoizedCurrentTime}
            </span>
            <div className="flex-1 h-[1.5px] sm:h-[2px] md:h-[2.5px] bg-white/30 rounded-full overflow-hidden min-w-0">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, podcastProgressPercentage))}%` }}
              />
            </div>
            <span className="text-white text-[clamp(0.5rem,1.3vw,0.65rem)] font-medium whitespace-nowrap flex-shrink-0">
              {memoizedPodcastDuration}
            </span>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePodcastPlay}
          className="w-[9%] sm:w-[8.5%] md:w-[8%] aspect-square rounded-full bg-primary-300 hover:bg-primary-200 flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label={currentTrack?.id === podcast?.id && isPlaying ? "Pause podcast" : "Play podcast"}
        >
          {currentTrack?.id === podcast?.id && isPlaying ? (
            <Pause className="w-[32%] h-[32%] text-white" fill="white" />
          ) : (
            <Play className="w-[32%] h-[32%] text-white" fill="white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PodcastPlayer;

