import { useCallback } from 'react';
import { useAudioPlayer, AudioTrack } from './AudioPlayerContext';

export const useAudioPlayerControls = () => {
  const { state, play, pause, stop, seek, setVolume, toggleMute, loadTrack, clearError, setVisible } = useAudioPlayer();

  const playTrack = useCallback((track: AudioTrack) => {
    play(track);
  }, [play]);

  const playCurrentTrack = useCallback(() => {
    if (state.currentTrack) {
      play();
    }
  }, [play, state.currentTrack]);

  const pauseCurrentTrack = useCallback(() => {
    pause();
  }, [pause]);

  const stopCurrentTrack = useCallback(() => {
    stop();
  }, [stop]);

  const seekToTime = useCallback((time: number) => {
    seek(time);
  }, [seek]);

  const seekToPercentage = useCallback((percentage: number) => {
    if (state.duration > 0) {
      const time = (percentage / 100) * state.duration;
      seek(time);
    }
  }, [seek, state.duration]);

  const setVolumeLevel = useCallback((volume: number) => {
    setVolume(volume);
  }, [setVolume]);

  const toggleMuteState = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  const loadNewTrack = useCallback((track: AudioTrack) => {
    loadTrack(track);
  }, [loadTrack]);

  const clearErrorMessage = useCallback(() => {
    clearError();
  }, [clearError]);

  const setPlayerVisible = useCallback((visible: boolean) => {
    setVisible(visible);
  }, [setVisible]);

  return {
    // State
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    isMuted: state.isMuted,
    isLoading: state.isLoading,
    error: state.error,
    isVisible: state.isVisible,
    
    // Actions
    playTrack,
    playCurrentTrack,
    pauseCurrentTrack,
    stopCurrentTrack,
    seekToTime,
    seekToPercentage,
    setVolumeLevel,
    toggleMuteState,
    setPlayerVisible,
    loadNewTrack,
    clearErrorMessage,
  };
};