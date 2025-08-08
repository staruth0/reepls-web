import { createContext, useContext } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  isVisible: boolean;
}

export interface AudioPlayerContextType {
  state: AudioPlayerState;
  play: (track?: AudioTrack) => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadTrack: (track: AudioTrack) => void;
  clearError: () => void;
  setVisible: (visible: boolean) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};