import React from 'react';
import { useAudioPlayerControls, AudioTrack } from './index';

const AudioPlayerDemo: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, currentTime, duration } = useAudioPlayerControls();

  // Sample audio tracks for demonstration
  const sampleTracks: AudioTrack[] = [
    {
      id: '1',
      title: 'Sample Track 1',
      artist: 'Artist 1',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://via.placeholder.com/48x48/4f46e5/ffffff?text=1',
    },
    {
      id: '2',
      title: 'Sample Track 2',
      artist: 'Artist 2',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      thumbnail: 'https://via.placeholder.com/48x48/7c3aed/ffffff?text=2',
    },
  ];

  const handlePlayTrack = (track: AudioTrack) => {
    playTrack(track);
  };

  return (
    <div className="p-6 bg-neutral-800 text-neutral-50">
      <h2 className="text-2xl font-bold mb-6">Audio Player Demo</h2>
      
      <div className="grid gap-4">
        {sampleTracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 bg-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors"
            onClick={() => handlePlayTrack(track)}
          >
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{track.title}</h3>
              <p className="text-sm text-neutral-400">{track.artist}</p>
            </div>
            <button className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors">
              Play
            </button>
          </div>
        ))}
      </div>

      {currentTrack && (
        <div className="mt-6 p-4 bg-neutral-700 rounded-lg">
          <h3 className="font-semibold mb-2">Currently Playing:</h3>
          <p className="text-sm text-neutral-400">
            {currentTrack.title} - {currentTrack.artist}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Status: {isPlaying ? 'Playing' : 'Paused'} | 
            Time: {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayerDemo; 