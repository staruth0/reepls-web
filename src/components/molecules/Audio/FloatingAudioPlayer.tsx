import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LuPlay, LuPause, LuVolume2, LuX, LuSkipBack, LuSkipForward, LuVolumeX } from 'react-icons/lu';
import { useAudioPlayer } from '../../../hooks/useAudioplayer';
import Slider from '../../atoms/Slider';
import { Pics } from '../../../assets/images';

const FloatingAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
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

  useEffect(() => {
    if (!currentTrack) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    setIsLoading(true);
    
    // Set initial position to bottom right
    if (playerRef.current) {
      setPosition({
        x: window.innerWidth - playerRef.current.offsetWidth - 20,
        y: window.innerHeight - playerRef.current.offsetHeight - 20
      });
    }
  }, [currentTrack]);

  // Track loading state
  useEffect(() => {
    if (currentTrack && duration > 0) {
      setIsLoading(false);
    }
  }, [currentTrack, duration]);

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
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  }, [isDragging, offset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - offset.x,
      y: touch.clientY - offset.y
    });
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

  const skipForward = () => {
    const newTime = Math.min(progress + 15, duration);
    seek(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(progress - 15, 0);
    seek(newTime);
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <div
      ref={playerRef}
      className="fixed z-[10000] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 p-4 w-96 max-w-full cursor-move select-none backdrop-blur-sm touch-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
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
          className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-700"
        >
          <LuX size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
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
          className="p-2 rounded-full hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all duration-200"
          title="Skip backward 15s"
        >
          <LuSkipBack size={20} />
        </button>
        
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          className="p-2 rounded-full hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all duration-200"
          title="Skip forward 15s"
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