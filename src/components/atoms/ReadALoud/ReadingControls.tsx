import { Loader2, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAudioPlayer } from '../../../providers/AudioProvider';
import { apiClient } from '../../../services/apiClient';

type AudioState = 'idle' | 'generating' | 'ready' | 'playing' | 'paused' | 'error';

export const ReadingControls = ({ article_id, article_tts }: { article_id: string; article_tts: string }) => {
  const { activeAudio, setActiveAudio } = useAudioPlayer();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(article_tts || null);

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
  }, [audioUrl]);

  const stopAudio = () => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      setActiveAudio(null);
      setAudioState('ready');
    }
  };

  const handleSpeak = async () => {
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

    // If another article is playing, stop it
    if (activeAudio && audioState !== 'playing') {
      stopAudio();
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
    } else {
      activeAudio.pause();
      setAudioState('paused');
    }
  };

  const getReadingStatusText = (audioState: AudioState) => {
    switch (audioState) {
      case 'generating':
        return 'Generating...';
      case 'playing':
        return 'Reading...';
      case 'paused':
        return 'Paused';
      case 'error':
        return 'Error';
      default:
        return 'Read Aloud';
    }
  };

  const getReadingStatusIcon = (audioState: AudioState) => {
    switch (audioState) {
      case 'generating':
        return <Loader2 className="size-5 animate-spin" />;
      case 'playing':
        return <Volume2 className="size-5 text-neutral-500" />;
      case 'paused':
        return <PauseCircle className="size-5 text-neutral-500" />;
      case 'error':
        return <VolumeX className="size-5 text-neutral-500" />;
      default:
        return <Volume2 className="size-5 text-neutral-500" />;
    }
  };

  const getControlButtonAction = (audioState: AudioState) => {
    if (audioState === 'playing' || audioState === 'paused') {
      return stopAudio;
    }
    return handleSpeak;
  };

  return (
    <div className="flex justify-end my-4 gap-2">
      <button
        onClick={getControlButtonAction(audioState)}
        disabled={audioState === 'generating'}
        className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2 disabled:opacity-50">
        {getReadingStatusIcon(audioState)}
        {getReadingStatusText(audioState)}
      </button>
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
