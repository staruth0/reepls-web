import React, { useState, useRef, useEffect } from 'react';
import { LuPlay, LuPause, LuVolume2, LuX } from 'react-icons/lu';
import { useAudioPlayer } from '../../../hooks/useAudioplayer';
import Slider from '../../atoms/Slider';

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
    
    // Set initial position to bottom right
    if (playerRef.current) {
      setPosition({
        x: window.innerWidth - playerRef.current.offsetWidth - 20,
        y: window.innerHeight - playerRef.current.offsetHeight - 20
      });
    }
  }, [currentTrack]);

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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleClose = () => {
    pause();
    clearCurrentTrack(); // This should be a function in your useAudioPlayer hook that sets currentTrack to null
    setIsVisible(false);
  };

  if (!currentTrack || !isVisible) return null;

  return (
    <div
      ref={playerRef}
      className="fixed z-[10000] bg-neutral-800 rounded-lg shadow-xl p-3 w-80 max-w-full cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {currentTrack.thumbnail && (
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div className="overflow-hidden">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-xs text-neutral-400 truncate">
              {currentTrack.author || 'Unknown'}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-neutral-400 hover:text-neutral-200"
        >
          <LuX size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={togglePlay}
          className="p-1 rounded-full hover:bg-neutral-700"
        >
          {isPlaying ? <LuPause size={20} /> : <LuPlay size={20} />}
        </button>
        
        <div className="flex-1">
          <Slider
            min={0}
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
        
        <div className="text-xs text-neutral-400 w-16 text-right">
          {formatTime(progress)} / {formatTime(duration)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LuVolume2 size={16} className="text-neutral-400" />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default FloatingAudioPlayer;