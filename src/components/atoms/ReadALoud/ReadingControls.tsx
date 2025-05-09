import { AudioLines, Loader2, PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { useAudioPlayer } from '../../../providers/AudioProvider';
import { apiClient } from '../../../services/apiClient';
import { cn } from '../../../utils';
import { Article } from '../../../models/datamodels';
import { useUpdateArticle } from '../../../feature/Blog/hooks/useArticleHook';
import { t } from 'i18next';

type AudioState = 'idle' | 'generating' | 'ready' | 'playing' | 'paused' | 'error';

export const ReadingControls = ({ article_id, article_tts,article }: { article_id: string; article_tts: string,article:Article }) => {
  const { isLoggedIn } = useUser(); // Use isLoggedIn instead of authUser
  const { activeAudio, setActiveAudio } = useAudioPlayer();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(article_tts || null);
  const [hasEngaged, setHasEngaged] = useState(false); 
   const { mutate } = useUpdateArticle();

  useEffect(() => {
    if (article_tts) {
      setAudioUrl(article_tts);
      setAudioState('ready');
    }

    return () => {
      if (audioState === 'playing' || audioState === 'paused') {
        stopAudio();
      }
    };
  }, [article_tts]);

  useEffect(() => {
    if (activeAudio) {
      activeAudio.addEventListener('ended', () => {
        setAudioState('idle');
      });
      if (activeAudio.src !== audioUrl) {
        setAudioState('ready');
      }
    }
  }, [activeAudio]);

  const stopAudio = () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      setActiveAudio(null);
      setAudioState('idle');
    }
  };

  const handlePlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to read aloud');
      return;
    }
    // If another article is playing, stop it first
    if (activeAudio) {
      stopAudio();
    }

       // Increment engagement count only once per component instance
    if (!hasEngaged) {
      setHasEngaged(true);
      mutate({
        articleId: article._id || '',
        article: {
          engagement_count: (article.engagement_count || 0) + 1, // Corrected typo from engagement_ount
        },
      });
    }

    if (!audioUrl) {
      setAudioState('generating');
      try {
        if (!article_id) {
          throw new Error('Article ID is required');
        }
        const newAudioUrl = await generateTTS(article_id);
        if (newAudioUrl) {
          setAudioUrl(newAudioUrl);
          const audio = new Audio(newAudioUrl);
          setActiveAudio(audio);
          audio.play();
          setAudioState('playing');
        
        } else {
          setAudioState('error');
          toast.error('Failed to generate audio');
        }
      } catch (error) {
        setAudioState('error');
        toast.error('Failed to generate audio');
      }
      return;
    }

    const audio = new Audio(audioUrl);
    setActiveAudio(audio);
    audio.play();
    setAudioState('playing');
  };

  const handlePauseResume = () => {
    if (!activeAudio) return;

    if (audioState === 'paused') {
      activeAudio.play();
      setAudioState('playing');
    } else if (audioState === 'playing') {
      activeAudio.pause();
      setAudioState('paused');
    }
  };

  const getReadingStatusText = (audioState: AudioState) => {
    switch (audioState) {
      case 'idle':
        return t('Read Aloud');
      case 'generating':
        return t('Generating...');
      case 'playing':
        return t('Reading...');
      case 'paused':
        return 'Paused';
      case 'ready':
        return t('Read Aloud');
      case 'error':
        return 'Error';
      default:
        return t('Read Aloud');
    }
  };

  const getReadingStatusIcon = (audioState: AudioState) => {
    switch (audioState) {
      case 'idle':
      case 'ready':
        return <AudioLines className="size-5" />;
      case 'generating':
        return <Loader2 className="size-5 animate-spin" />;
      case 'playing':
        return <PauseCircle className="size-5" />;
      case 'paused':
        return <PlayCircle className="size-5" />;
      case 'error':
        return <VolumeX className="size-5 text-red-500" />;
      default:
        return <Volume2 className="size-5" />;
    }
  };

  const getControlButtonAction = (state: AudioState): (() => void) => {
    switch (state) {
      case 'idle':
      case 'ready':
        return handlePlay;
      case 'playing':
      case 'paused':
        return handlePauseResume;
      case 'generating':
        return () => {}; // No-op while generating
      case 'error':
        return handlePlay; // Retry on error
      default:
        return () => {};
    }
  };

  return (
    <button
      onClick={getControlButtonAction(audioState)}
      disabled={audioState === 'generating'}
      className={cn(
        'hover:text-primary-400 disabled:opacity-50 cursor-pointer flex items-center gap-2',
        audioState === 'playing' && 'text-primary-400',
        audioState === 'error' && 'text-red-500',
        (audioState === 'generating' || audioState === 'playing') && 'animate-pulse'
      )}>
      {getReadingStatusIcon(audioState)}
      {getReadingStatusText(audioState)}
    </button>
  );
};

// Generate TTS for an article
const generateTTS = async (articleId: string): Promise<string | null> => {
  try {
    const { data } = await apiClient.get(`/tts/${articleId}`);
       return data?.ttsResult?.audioUrl || null;
  } catch (error) {
    console.error('Error generating TTS:', error);
    return null;
  }
};
