import React from 'react';
import { useAudioPlayerControls, AudioTrack } from './index';

// Example of how to integrate with your podcast feature
const PodcastIntegrationExample: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayerControls();

  // Example function to convert your podcast data to AudioTrack format
  const convertPodcastToAudioTrack = (podcast: any): AudioTrack => {
    return {
      id: podcast.id || podcast._id,
      title: podcast.title,
      artist: podcast.author?.name || podcast.creator?.name,
      url: podcast.audioUrl || podcast.audio_url,
      thumbnail: podcast.thumbnail || podcast.thumbnailUrl,
      duration: podcast.duration,
    };
  };

  // Example usage in a podcast list
  const handlePlayPodcast = (podcast: any) => {
    const audioTrack = convertPodcastToAudioTrack(podcast);
    playTrack(audioTrack);
  };

  // Example podcast data structure (based on your existing podcast feature)
  const examplePodcast = {
    id: 'podcast-1',
    title: 'My First Podcast',
    author: { name: 'John Doe' },
    audioUrl: 'https://example.com/podcast.mp3',
    thumbnail: 'https://example.com/thumbnail.jpg',
    duration: 1800, // 30 minutes in seconds
  };

  return (
    <div className="p-4 bg-neutral-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Podcast Integration Example</h3>
      
      <div className="flex items-center gap-4 p-3 bg-neutral-600 rounded-lg">
        <img
          src={examplePodcast.thumbnail}
          alt={examplePodcast.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium">{examplePodcast.title}</h4>
          <p className="text-sm text-neutral-400">{examplePodcast.author.name}</p>
        </div>
        <button
          onClick={() => handlePlayPodcast(examplePodcast)}
          className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          {currentTrack?.id === examplePodcast.id && isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {currentTrack && (
        <div className="mt-4 p-3 bg-neutral-600 rounded-lg">
          <p className="text-sm">
            <strong>Now Playing:</strong> {currentTrack.title}
            {currentTrack.artist && ` by ${currentTrack.artist}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PodcastIntegrationExample; 