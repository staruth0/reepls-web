import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LuPlay, LuPause, LuVolume2, LuX, LuSkipBack, LuSkipForward, LuVolumeX } from 'react-icons/lu';
import { useAudioPlayer } from '../../../hooks/useAudioplayer';
import Slider from '../../atoms/Slider';
import { Pics } from '../../../assets/images';
import { useGetPopularPodcasts } from '../../../feature/Podcast/hooks';
import { toast } from 'react-toastify';

const FloatingAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    play,
    togglePlay,
    progress,
    duration,
    volume,
    setVolume,
    pause,
    seek,
    clearCurrentTrack, 
  } = useAudioPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Podcast navigation state
  const [podcastHistory, setPodcastHistory] = useState<Array<{
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    author?: string;
  }>>([]);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasBeenPositioned, setHasBeenPositioned] = useState(false);

  // Fetch popular podcasts for navigation
  const { data: popularPodcastsData, isLoading: isLoadingPodcasts } = useGetPopularPodcasts({
    limit: 50, // Get more podcasts for better variety
    page: 1
  });

  useEffect(() => {
    if (!currentTrack) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    setIsLoading(true);
    
    // Only set initial position if this is the first time showing the player
    if (playerRef.current && !hasBeenPositioned) {
      const playerWidth = 320; // w-80 = 320px
      const playerHeight = 200; // Approximate height
      const margin = 20;
      
      setPosition({
        x: Math.max(margin, window.innerWidth - playerWidth - margin),
        y: Math.max(margin, window.innerHeight - playerHeight - margin)
      });
      setHasBeenPositioned(true);
    }
  }, [currentTrack, hasBeenPositioned]);

  // Track loading state
  useEffect(() => {
    if (currentTrack && duration > 0) {
      setIsLoading(false);
    }
  }, [currentTrack, duration]);

  // Initialize current track in history when it changes
  useEffect(() => {
    if (currentTrack && podcastHistory.length === 0) {
      // If this is the first track and we don't have history, add it
      setPodcastHistory([currentTrack]);
      setCurrentPodcastIndex(0);
    }
  }, [currentTrack, podcastHistory.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the drag handle area
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      if (playerRef.current) {
        const rect = playerRef.current.getBoundingClientRect();
        setOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow dragging from the drag handle area
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      if (playerRef.current) {
        const rect = playerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        });
        setIsDragging(true);
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !playerRef.current) return;
    
    const playerWidth = playerRef.current.offsetWidth;
    const playerHeight = playerRef.current.offsetHeight;
    const margin = 10;
    
    setPosition({
      x: Math.max(margin, Math.min(e.clientX - offset.x, window.innerWidth - playerWidth - margin)),
      y: Math.max(margin, Math.min(e.clientY - offset.y, window.innerHeight - playerHeight - margin))
    });
    setHasBeenPositioned(true); // Mark as positioned when user drags
  }, [isDragging, offset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !playerRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const playerWidth = playerRef.current.offsetWidth;
    const playerHeight = playerRef.current.offsetHeight;
    const margin = 10;
    
    setPosition({
      x: Math.max(margin, Math.min(touch.clientX - offset.x, window.innerWidth - playerWidth - margin)),
      y: Math.max(margin, Math.min(touch.clientY - offset.y, window.innerHeight - playerHeight - margin))
    });
    setHasBeenPositioned(true); // Mark as positioned when user drags
  }, [isDragging, offset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, offset, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleClose = () => {
    pause();
    clearCurrentTrack(); // This should be a function in your useAudioPlayer hook that sets currentTrack to null
    setIsVisible(false);
  };

  const handleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Get available podcasts for navigation
  const getAvailablePodcasts = () => {
    if (popularPodcastsData?.data?.results) {
      return popularPodcastsData.data.results;
    }
    return [];
  };

  // Get a random podcast from available podcasts
  const getRandomPodcast = () => {
    const podcasts = getAvailablePodcasts();
    if (podcasts.length === 0) return null;
    
    // Filter out current track if it exists
    const filteredPodcasts = podcasts.filter((podcast: { id?: string; _id?: string }) => 
      (podcast.id || podcast._id) !== currentTrack?.id
    );
    if (filteredPodcasts.length === 0) return podcasts[0]; // Fallback to any podcast
    
    const randomIndex = Math.floor(Math.random() * filteredPodcasts.length);
    return filteredPodcasts[randomIndex];
  };

  // Convert podcast data to audio track format
  const convertPodcastToTrack = (podcast: {
    id?: string;
    _id?: string;
    title?: string;
    audio?: { url?: string };
    thumbnailUrl?: string;
    authorId?: { name?: string };
    author?: { name?: string };
  }) => {
    return {
      id: podcast.id || podcast._id || '',
      title: podcast.title || 'Untitled Podcast',
      url: podcast.audio?.url || '',
      thumbnail: podcast.thumbnailUrl || Pics.podcastimg,
      author: podcast.authorId?.name || podcast.author?.name || 'Unknown Artist'
    };
  };

  // Navigate to next podcast
  const skipForward = async () => {
    if (isNavigating || isLoadingPodcasts) return;
    
    setIsNavigating(true);
    
    try {
      // If we have history and not at the end, go to next in history
      if (currentPodcastIndex < podcastHistory.length - 1) {
        const nextTrack = podcastHistory[currentPodcastIndex + 1];
        play(nextTrack);
        setCurrentPodcastIndex(prev => prev + 1);
        // toast.success(`Playing: ${nextTrack.title}`);
      } else {
        // Get a new random podcast
        const randomPodcast = getRandomPodcast();
        if (randomPodcast) {
          const track = convertPodcastToTrack(randomPodcast);
          play(track);
          
          // Add to history
          setPodcastHistory(prev => [...prev, track]);
          setCurrentPodcastIndex(prev => prev + 1);
          toast.success(`Playing: ${track.title}`);
        } else {
          toast.error('No podcasts available');
        }
      }
    } catch (error) {
      console.error('Error navigating to next podcast:', error);
      toast.error('Failed to load next podcast');
    } finally {
      setIsNavigating(false);
    }
  };

  // Navigate to previous podcast
  const skipBackward = async () => {
    if (isNavigating || currentPodcastIndex <= 0) return;
    
    setIsNavigating(true);
    
    try {
      const prevTrack = podcastHistory[currentPodcastIndex - 1];
      if (prevTrack) {
        play(prevTrack);
        setCurrentPodcastIndex(prev => prev - 1);
        // toast.success(`Playing: ${prevTrack.title}`);
      }
    } catch (error) {
      console.error('Error navigating to previous podcast:', error);
      toast.error('Failed to load previous podcast');
    } finally {
      setIsNavigating(false);
    }
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <div
      ref={playerRef}
      className="fixed z-[10000] bg-gradient-to-br from-neutral-500 via-neutral-400 to-neutral-400 rounded-2xl shadow-2xl p-3 sm:p-4 w-80 sm:w-96 max-w-[calc(100vw-2rem)] select-none backdrop-blur-sm touch-none"
      style={{
        left: `${Math.min(position.x, window.innerWidth - 320)}px`, // Prevent overflow
        top: `${Math.min(position.y, window.innerHeight - 200)}px`, // Prevent overflow
        userSelect: 'none',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Drag Handle Area */}
      <div 
        className="drag-handle cursor-move flex items-center justify-center py-3 mb-2 rounded-t-lg hover:bg-neutral-700/30 transition-colors duration-200 active:bg-neutral-600/40 select-none border-b border-neutral-600/30"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Drag to move player"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <div className="flex space-x-1.5">
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full hover:bg-neutral-300 transition-colors"></div>
        </div>
      </div>

      {/* Header with close button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {/* Thumbnail with fallback */}
          <div className="relative">
            <img
              src={currentTrack.thumbnail || Pics.podcastimg}
              alt={currentTrack.title}
              className={`w-14 h-14 rounded-xl object-cover shadow-lg border border-neutral-600 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              onError={(e) => {
                e.currentTarget.src = Pics.podcastimg;
              }}
            />
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 bg-opacity-50 rounded-xl">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {/* Playing indicator */}
            {isPlaying && !isLoading && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-neutral-900"></div>
            )}
          </div>
          
          <div className="overflow-hidden flex-1">
            <h4 className="font-semibold text-white truncate text-sm">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-neutral-400 truncate">
              {currentTrack.author || 'Unknown Artist'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full"
        >
          <LuX size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 ">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 w-10 text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1">
            <Slider
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full"
            />
          </div>
          <span className="text-xs text-neutral-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={skipBackward}
          disabled={isNavigating || currentPodcastIndex <= 0}
          className="p-2 rounded-full text-neutral-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={currentPodcastIndex <= 0 ? "No previous podcast" : "Previous podcast"}
        >
          <LuSkipBack size={20} />
        </button>
        
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="p-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <LuPause size={24} />
          ) : (
            <LuPlay size={24} />
          )}
        </button>
        
        <button
          onClick={skipForward}
          disabled={isNavigating || isLoadingPodcasts}
          className="p-2 rounded-full text-neutral-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isLoadingPodcasts ? "Loading podcasts..." : "Next podcast"}
        >
          <LuSkipForward size={20} />
        </button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleMute}
          className="text-neutral-400 hover:text-white transition-colors p-1"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <LuVolumeX size={18} /> : <LuVolume2 size={18} />}
        </button>
        
        <div className="flex-1">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
        
        <span className="text-xs text-neutral-400 w-8 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default FloatingAudioPlayer;