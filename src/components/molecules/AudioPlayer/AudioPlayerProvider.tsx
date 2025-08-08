import React, { useReducer, useCallback, useEffect, useRef } from 'react';
import { AudioPlayerContext, AudioPlayerState, AudioTrack, AudioPlayerContextType } from './AudioPlayerContext';

type AudioPlayerAction =
  | { type: 'SET_CURRENT_TRACK'; payload: AudioTrack | null }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VISIBLE'; payload: boolean }
  | { type: 'RESET' };

const initialState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isLoading: false,
  error: null,
  isVisible: true,
};

const audioPlayerReducer = (state: AudioPlayerState, action: AudioPlayerAction): AudioPlayerState => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VISIBLE':
      return { ...state, isVisible: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioPlayerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    // Event listeners
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handlePlay = () => {
      dispatch({ type: 'SET_PLAYING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
    };

    const handlePause = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
    };

    const handleEnded = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    };

    const handleError = () => {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_PLAYING', payload: false });
    };

    const handleLoadStart = () => {
      dispatch({ type: 'SET_LOADING', payload: true });
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    const persistState = {
      currentTrack: state.currentTrack,
      currentTime: state.currentTime,
      volume: state.volume,
      isMuted: state.isMuted,
    };
    localStorage.setItem('audioPlayerState', JSON.stringify(persistState));
  }, [state.currentTrack, state.currentTime, state.volume, state.isMuted]);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('audioPlayerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.currentTrack) {
          dispatch({ type: 'SET_CURRENT_TRACK', payload: parsedState.currentTrack });
          dispatch({ type: 'SET_CURRENT_TIME', payload: parsedState.currentTime || 0 });
          dispatch({ type: 'SET_VOLUME', payload: parsedState.volume || 1 });
          dispatch({ type: 'SET_MUTED', payload: parsedState.isMuted || false });
        }
      } catch (error) {
        console.error('Failed to restore audio player state:', error);
      }
    }
  }, []);

  const loadTrack = useCallback((track: AudioTrack) => {
    if (!audioRef.current) return;

    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    audioRef.current.src = track.url;
    audioRef.current.load();
  }, []);

  const play = useCallback((track?: AudioTrack) => {
    if (!audioRef.current) return;

    if (track) {
      loadTrack(track);
    }

    audioRef.current.play().catch((error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    });
  }, [loadTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
      if (volume === 0) {
        dispatch({ type: 'SET_MUTED', payload: true });
      } else if (state.isMuted) {
        dispatch({ type: 'SET_MUTED', payload: false });
      }
    }
  }, [state.isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (state.isMuted) {
        audioRef.current.volume = state.volume;
        dispatch({ type: 'SET_MUTED', payload: false });
      } else {
        audioRef.current.volume = 0;
        dispatch({ type: 'SET_MUTED', payload: true });
      }
    }
  }, [state.isMuted, state.volume]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const setVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_VISIBLE', payload: visible });
  }, []);

  const contextValue: AudioPlayerContextType = {
    state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    toggleMute,
    loadTrack,
    clearError,
    setVisible,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};