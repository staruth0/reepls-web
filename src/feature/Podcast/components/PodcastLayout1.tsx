
import React from 'react';
import PodcastAuthorInfo from './PodcastAuthorInfo';
import PodcastEngagementMetrics from './PodcastEngagementMetrics'; 
import { User } from '../../../models/datamodels';
import { LuMic } from "react-icons/lu";
import { useAudioControls } from "../../../hooks/useMediaPlayer";


interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: User,
  title: string;
  description: string;
  publishDate: string;
  listenTime: string; 
  audioUrl?: string; // Audio URL for playback
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

interface PodcastCardProps {
  podcast: Podcast;
  onLike?: (podcastId: string) => void;
  onComment?: (podcastId: string) => void;
  onBookmark?: (podcastId: string) => void;
  onFollow?: (authorId: string) => void;
  onReadMore?: (podcastId: string) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  onComment,
  onReadMore,
}) => {
  // Audio controls for the podcast
  const { 
    isPlaying, 
    togglePlay, 
    currentTrack 
  } = useAudioControls({
    id: podcast.id,
    title: podcast.title,
    url: podcast.audioUrl || '',
    thumbnail: podcast.thumbnailUrl,
    author: podcast.author?.name,
  });

  const handleCommentClick = () => {
    console.log(`Commented on podcast: ${podcast.id}`);
    if (onComment) onComment(podcast.id);
  };

  const handlePodcastPlay = () => {
    togglePlay();
  };

  const handleReadMore = () => {
    if (onReadMore) onReadMore(podcast.id);
  };





  return (
    <div className="bg-neutral-800 rounded-lg shadow-md overflow-visible border border-neutral-700 h-full flex flex-col">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={podcast.thumbnailUrl}
          alt={podcast.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x200/444444/FFFFFF?text=Podcast+Thumbnail`;
          }}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Author Info */}
        <PodcastAuthorInfo
          author={podcast.author}
        
       
        />

        {/* Podcast Title */}
        <h2 className="text-[16px] font-bold text-neutral-50 mb-2 line-clamp-2">
          {podcast.title}
        </h2>

        {/* Podcast Description */}
        <p className="text-neutral-300 text-[12px] mb-2 line-clamp-3">
          {podcast.description}
        </p>

        {/* Read More Button */}
        <div className="mb-4 flex ">
          <button
            onClick={handleReadMore}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200"
          >
            Read More
          </button>
        </div>

        <div className='flex items-center justify-between mt-2'>
          {/* Date and Listen Time */}
          <div className="flex items-center gap-2 text-neutral-50 text-[13px] font-bold">
            <button 
              onClick={handlePodcastPlay}
              className={`p-2 rounded-full ${currentTrack?.id === podcast?.id && isPlaying ? 'bg-main-green' : 'bg-neutral-700'}`}
            >
              <LuMic size={18} className={currentTrack?.id === podcast?.id && isPlaying ? 'text-white' : 'text-neutral-300'} />
            </button>
            <div className='size-1 rounded-full bg-primary-400'></div>
            <span>{podcast.publishDate}</span>
          </div>

          {/* Engagement Metrics */}
          <PodcastEngagementMetrics
            comments={podcast.comments}
            onCommentClick={handleCommentClick}
            id={podcast.id}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;