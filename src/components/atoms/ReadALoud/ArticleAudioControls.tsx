import { Loader2, PauseCircle, PlayCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import WaveSurfer from 'wavesurfer.js';
import { Article } from '../../../models/datamodels';
import { apiClient } from '../../../services/apiClient';
import { t } from 'i18next';

type AudioState = 'idle' | 'generating' | 'ready' | 'playing' | 'paused' | 'error';

export const ArticleAudioControls = ({ article }: { article: Article }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(article.text_to_speech || null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      barWidth: 2,
      barHeight: 0,
      cursorWidth: 0,
      progressColor: '#57c016',
    });

    waveSurfer.load(audioUrl);
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
      setAudioState('ready');
    });

    waveSurfer.on('play', () => {
      setIsPlaying(true);
      setAudioState('playing');
    });

    waveSurfer.on('pause', () => {
      setIsPlaying(false);
      setAudioState('paused');
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [audioUrl]);

  const handlePlayPause = async () => {
    if (!audioUrl) {
      setAudioState('generating');
      try {
        if (!article._id) {
          throw new Error('Article ID is required');
        }
        const newAudioUrl = await generateTTS(article._id);
        if (newAudioUrl) {
          setAudioUrl(newAudioUrl);
          setAudioState('ready');
        } else {
          setAudioState('error');
          toast.error(t('Failed to generate audio'));
        }
      } catch (error) {
        setAudioState('error');
        toast.error(t('Failed to generate audio'));
        console.log(error)
      }
      return;
    }

    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={handlePlayPause}
          type="button"
          disabled={audioState === 'generating'}
          className="disabled:opacity-50 flex items-center justify-center h-12 w-12">
          {audioState === 'generating' ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isPlaying ? (
            <PauseCircle className="size-8" />
          ) : (
            <PlayCircle className="size-8" />
          )}
        </button>

        {!audioUrl && audioState === 'idle' && (
          <div className="flex items-center gap-2">
            <span>{t("Click play to generate speech for this article")}</span>
          </div>
        )}

        {audioState === 'generating' && (
          <div className="flex items-center gap-2">
            <span className="animate-pulse ">{t("Generating audio...")}</span>
          </div>
        )}

        {audioState === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <span>{t("Error generating audio. Click play to try again.")}</span>
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="w-full">
          <div ref={containerRef} className="flex-1" />
        </div>
      )}
    </div>
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
