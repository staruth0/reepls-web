import { useAudioPlayer } from "./useAudioplayer";


export const useAudioControls = (track?: {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  author?: string;
}) => {
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer();

  const handlePlay = () => {
    if (track) {
      play(track);
    }
  };

  const handlePause = () => {
    pause();
  };

  const togglePlay = () => {
    if (!track) return;
    
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
    } else {
      play(track);
    }
  };

  return {
    isPlaying: currentTrack?.id === track?.id && isPlaying,
    handlePlay,
    handlePause,
    togglePlay,
    currentTrack,
  };
};