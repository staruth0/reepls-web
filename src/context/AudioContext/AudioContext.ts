import  { createContext} from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  author?: string;
}

export interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  play: (track: AudioTrack) => void;
  pause: () => void;
  togglePlay: () => void;
  progress: number;
  seek: (time: number) => void;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  clearCurrentTrack: () => void; 
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);