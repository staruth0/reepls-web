import React, { useContext } from "react";
import PodcastAuthorInfo from "./PodcastAuthorInfo"; 
import PodcastEngagementMetrics from "./PodcastEngagementMetrics"; 
import { User } from "../../../models/datamodels";
import { LuMic } from "react-icons/lu";
import { useAudioControls } from "../../../hooks/useMediaPlayer";
import { CognitiveModeContext } from "../../../context/CognitiveMode/CognitiveModeContext";

// Define the interface for the podcast data
interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: User | null;
  title: string;
  description: string;
  publishDate: string; // e.g., "Jun 26"
  listenTime: string; // e.g., "32 min"
  likes: number;
  comments: number;
  isBookmarked: boolean;
  audioUrl?: string; // Audio URL for playback
}

interface PodcastCardProps {
  podcast: Podcast;
  onLike?: (podcastId: string) => void;
  onComment?: (podcastId: string) => void;
  onBookmark?: (podcastId: string) => void;
  onFollow?: (authorId: string) => void;
  onReadMore?: (podcastId: string) => void;
}

const PodcastCard2: React.FC<PodcastCardProps> = ({
  podcast,
  onComment,
  onReadMore,
}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  // Audio controls for the podcast
  const { 
    isPlaying, 
    togglePlay, 
    currentTrack 
  } = useAudioControls({
    id: podcast.id,
    title: podcast.title,
    url: podcast.audioUrl || '', // You'll need to add this to your Podcast interface
    thumbnail: podcast.thumbnailUrl,
    author: podcast.author?.name || 'Unknown',
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
    <div className="bg-neutral-800 rounded-lg shadow-md overflow-visible border border-neutral-700 flex flex-col p-2">
    
      <div className="flex flex-row-reverse items-start gap-4 mb-4"> 
       
   {!isCognitiveMode &&     <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-md"> 
          <img
            src={podcast.thumbnailUrl}
            alt={podcast.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/128x128/444444/FFFFFF?text=Thumb`;
            }}
          />
        </div>}

      
        <div className="flex-1 min-w-0"> 
          {/* Author Info */}
          <PodcastAuthorInfo
            author={podcast.author}
           
          />

          {/* Podcast Title */}
          <h2 className="text-[16px] font-bold text-neutral-50 mb-2 line-clamp-2 break-words">
            {podcast.title}
          </h2>

          {/* Podcast Description */}
          <p className="text-neutral-300 text-[12px] mb-2 line-clamp-3 break-words">
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
        </div>
      </div>

     
      <div className="flex items-center justify-between mt-auto"> 


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
  );
};

export default PodcastCard2;