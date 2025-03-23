import { Loader2, PauseCircle, PlayCircle, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Article } from '../../../models/datamodels';

export const ReadAloud = ({ article }: { article: Article }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (article.text_to_speech) {
      setAudio(new Audio(article.text_to_speech));
    }
  }, [article.text_to_speech]);

  const handleSpeak = () => {
    setIsGenerating(true);
    setIsReading(true);
    setIsPaused(false);
    setIsStopped(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const cancelSpeaking = () => {
    setIsReading(false);
    setIsPaused(false);
    setIsStopped(true);
  };

  const getReadingStatusText = () => {
    if (isGenerating) return 'Generating...';
    if (isReading) return 'Reading...';
    if (isPaused) return 'Paused';
    if (isStopped) return 'Stopped';
    return 'Read Aloud';
  };

  return (
    <div className="flex justify-end my-4 gap-2">
      <button
        onClick={isReading ? cancelSpeaking : handleSpeak}
        className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
        {isGenerating ? (
          <Loader2 className="size-5 animate-spin" />
        ) : isReading ? (
          <Volume2 className="size-5 text-neutral-500" />
        ) : (
          <Volume2 className="size-5 text-neutral-500" />
        )}
        {getReadingStatusText()}
      </button>
      {isReading && (
        <button onClick={handlePauseResume} className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
          {isPaused ? (
            <PlayCircle className="size-5 text-neutral-500" />
          ) : (
            <PauseCircle className="size-5 text-neutral-500" />
          )}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
    </div>
  );
};

/*import { Loader2, PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Article } from '../../../models/datamodels';
import { useAudioPlayer } from '../../../providers/AudioProvider';
import { apiClient } from '../../../services/apiClient';
type AudioState = 'idle' | 'generating' | 'ready' | 'playing' | 'paused' | 'error';

export const ArticleAudioControls = ({ article }: { article: Article }) => {
  const { activeAudio, setActiveAudio } = useAudioPlayer();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [buttonIcon, setButtonIcon] = useState<React.ReactNode>(<PlayCircle className="size-5" />);
  const [buttonText, setButtonText] = useState('Play');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(activeAudio?.src === article.text_to_speech);
  // Check if this article's audio is currently playing

  useEffect(() => {
    // If the article has TTS, set state to ready
    if (article.text_to_speech) {
      setAudioState('ready');
    }

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (isPlaying) {
        stopAudio();
      }
    };
  }, [article.text_to_speech]);

  const generateAudio = async () => {
    if (!article._id) return;

    setAudioState('generating');
    try {
      const audioUrl = await generateTTS(article._id);
      if (audioUrl) {
        // Update the article's text_to_speech URL
        article.text_to_speech = audioUrl;
        setIsPlaying(true);
        setAudioState('ready');
        // Start playing automatically
        playAudio();
      } else {
        setAudioState('error');
        toast.error('Failed to generate speech');
      }
    } catch (error) {
      console.error('Error generating TTS:', error);
      setAudioState('error');
      toast.error('Failed to generate speech');
    }
  };

  const playAudio = () => {
    if (!article.text_to_speech) {
      generateAudio();
      return;
    }

    // If another article is playing, stop it
    if (activeAudio && !isPlaying) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    // Create new audio element if needed
    if (!activeAudio || !isPlaying) {
      const audio = new Audio(article.text_to_speech);
      audio.volume = isMuted ? 0 : volume;
      setActiveAudio(audio);
      audio.play();
      setAudioState('playing');
    } else {
      // Resume current audio
      activeAudio.play();
      setAudioState('playing');
    }
  };

  const pauseAudio = () => {
    if (activeAudio && isPlaying) {
      activeAudio.pause();
      setAudioState('paused');
    }
  };

  const stopAudio = () => {
    if (activeAudio && isPlaying) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      setActiveAudio(null);
      setAudioState('ready');
    }
  };

  const toggleMute = () => {
    if (activeAudio && isPlaying) {
      setIsMuted(!isMuted);
      activeAudio.volume = isMuted ? volume : 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (activeAudio && isPlaying) {
      activeAudio.volume = isMuted ? 0 : newVolume;
    }
  };

  const getButtonIcon = () => {
    switch (audioState) {
      case 'generating':
        return <Loader2 className="size-5 animate-spin" />;
      case 'playing':
      case 'paused':
        return <Volume2 className="size-5" />;
      default:
        return <Volume2 className="size-5" />;
    }
  };

  const getButtonText = () => {
    switch (audioState) {
      case 'generating':
        return 'Generating...';
      case 'playing':
        return 'Playing';
      case 'paused':
        return 'Paused';
      case 'error':
        return 'Error';
      default:
        return 'Play';
    }
  };

  useEffect(() => {
    setButtonIcon(getButtonIcon());
    setButtonText(getButtonText());
  }, [audioState]);

  return (
    <div className="flex items-center gap-4 my-4">
      <button
        onClick={isPlaying ? stopAudio : playAudio}
        className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
        {buttonIcon}
        {buttonText}
      </button>

      {(audioState === 'playing' || audioState === 'paused') && (
        <button
          onClick={audioState === 'playing' ? pauseAudio : playAudio}
          className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2">
          {audioState === 'playing' ? <PauseCircle className="size-5" /> : <PlayCircle className="size-5" />}
          {audioState === 'playing' ? 'Pause' : 'Resume'}
        </button>
      )}

      {(audioState === 'playing' || audioState === 'paused') && (
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-neutral-800">
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};

// Generate TTS for an article
const generateTTS = async (articleId: string): Promise<string | null> => {
  try {
    const { data } = await apiClient.get(`/tts/${articleId}`);
    return data?.audioUrl || null;
  } catch (error) {
    console.error('Error generating TTS:', error);
    return null;
  }
};
*/
