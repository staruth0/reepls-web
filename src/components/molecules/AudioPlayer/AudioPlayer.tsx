import React, { useRef, useEffect, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAudioPlayer } from './AudioPlayerContext';
import { LuPlay, LuPause, LuVolume2, LuVolumeX, LuSkipBack, LuSkipForward, LuX } from 'react-icons/lu';
import './AudioPlayer.scss';

interface AudioPlayerProps {
  className?: string;
  inline?: boolean; // When true, the player is rendered inline instead of fixed at bottom
  onClose?: () => void; // Function to close the player when in fixed mode
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '', inline = false, onClose }) => {
  const { state, play, pause, seek, setVolume, toggleMute } = useAudioPlayer();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isWaveformReady, setIsWaveformReady] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !state.currentTrack) return;

    // Destroy existing instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    // Create new WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      cursorColor: '#ffffff',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 60,
      barGap: 3,
      normalize: true,
    });

    wavesurferRef.current = wavesurfer;

    // Load audio
    wavesurfer.load(state.currentTrack.url);

    // Event listeners
    const handleReady = () => {
      setIsWaveformReady(true);
    };

    const handlePlay = () => {
      play();
    };

    const handlePause = () => {
      pause();
    };

    const handleFinish = () => {
      pause();
    };

    wavesurfer.on('ready', handleReady);
    wavesurfer.on('play', handlePlay);
    wavesurfer.on('pause', handlePause);
    wavesurfer.on('finish', handleFinish);

    return () => {
      wavesurfer.un('ready', handleReady);
      wavesurfer.un('play', handlePlay);
      wavesurfer.un('pause', handlePause);
      wavesurfer.un('finish', handleFinish);
    };
  }, [state.currentTrack?.url, play, pause, seek, state.duration]);

  // Sync WaveSurfer with audio state
  useEffect(() => {
    if (!wavesurferRef.current || !isWaveformReady) return;

    const wavesurfer = wavesurferRef.current;

    if (state.isPlaying) {
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }
  }, [state.isPlaying, isWaveformReady]);

  // Sync progress
  useEffect(() => {
    if (!wavesurferRef.current || !isWaveformReady || state.duration === 0) return;

    const wavesurfer = wavesurferRef.current;
    wavesurfer.setTime(state.currentTime);
  }, [state.currentTime, state.duration, isWaveformReady]);

  const handlePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const handleSkipBackward = useCallback(() => {
    const newTime = Math.max(0, state.currentTime - 10);
    seek(newTime);
  }, [state.currentTime, seek]);

  const handleSkipForward = useCallback(() => {
    const newTime = Math.min(state.duration, state.currentTime + 10);
    seek(newTime);
  }, [state.currentTime, state.duration, seek]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
  }, [setVolume]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Don't render if no track is loaded
  if (!state.currentTrack) {
    return null;
  }

  // Don't render if not visible and not inline
  if (!state.isVisible && !inline) {
    return null;
  }

  return (
    <div className={`audio-player ${inline ? 'audio-player--inline' : 'audio-player--fixed'} ${className}`}>
      {!inline && onClose && (
        <button 
          onClick={onClose} 
          className="audio-player__close-btn" 
          aria-label="Close audio player"
        >
          <LuX size={18} />
        </button>
      )}
      <div className="audio-player__container">
        {/* Track Info */}
        <div className="audio-player__info">
          {state.currentTrack.thumbnail && (
            <img
              src={state.currentTrack.thumbnail}
              alt={state.currentTrack.title}
              className="audio-player__thumbnail"
            />
          )}
          <div className="audio-player__details">
            <h4 className="audio-player__title">{state.currentTrack.title}</h4>
            {state.currentTrack.artist && (
              <p className="audio-player__artist">{state.currentTrack.artist}</p>
            )}
          </div>
        </div>

        {/* Waveform */}
        <div className="audio-player__waveform">
          <div ref={waveformRef} className="audio-player__waveform-container" />
        </div>

        {/* Controls */}
        <div className="audio-player__controls">
          <div className="audio-player__main-controls">
            <button
              onClick={handleSkipBackward}
              className="audio-player__control-btn"
              title="Skip backward 10s"
            >
              <LuSkipBack className="audio-player__icon" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="audio-player__control-btn audio-player__control-btn--primary"
              disabled={state.isLoading}
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isLoading ? (
                <div className="audio-player__loading-spinner" />
              ) : state.isPlaying ? (
                <LuPause className="audio-player__icon" />
              ) : (
                <LuPlay className="audio-player__icon" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              className="audio-player__control-btn"
              title="Skip forward 10s"
            >
              <LuSkipForward className="audio-player__icon" />
            </button>
          </div>

          {/* Time Display */}
          <div className="audio-player__time">
            <span className="audio-player__time-current">
              {formatTime(state.currentTime)}
            </span>
            <span className="audio-player__time-separator">/</span>
            <span className="audio-player__time-total">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="audio-player__volume">
          <button
            onClick={toggleMute}
            className="audio-player__control-btn"
            title={state.isMuted ? 'Unmute' : 'Mute'}
          >
            {state.isMuted ? (
              <LuVolumeX className="audio-player__icon" />
            ) : (
              <LuVolume2 className="audio-player__icon" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.isMuted ? 0 : state.volume}
            onChange={handleVolumeChange}
            className="audio-player__volume-slider"
            title="Volume"
          />
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="audio-player__error">
          <p>{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;