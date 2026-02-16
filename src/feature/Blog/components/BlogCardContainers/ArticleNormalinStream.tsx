import React, { useContext, useEffect, useState } from 'react';
import { Article } from '../../../../models/datamodels';
import { ErrorBoundary } from 'react-error-boundary';
import { useUpdateArticle } from '../../hooks/useArticleHook';
import { CognitiveModeContext } from '../../../../context/CognitiveMode/CognitiveModeContext';
import ErrorFallback from '../../../../components/molecules/ErrorFallback/ErrorFallback';
import BlogArticleProfile from '../BlogComponents/BlogArticleProfile';
import BlogArticleImagery from '../BlogComponents/BlogArticleImagery';
import BlogArticleMessage from '../BlogComponents/BlogArticleMessage';
import BlogArticleReactionStats from '../BlogComponents/BlogArticleReactionStats';
import { calculateReadTime } from '../../../../utils/articles';

import { useAudioControls } from '../../../../hooks/useMediaPlayer';
import { LuMic } from 'react-icons/lu';
import { useGetPodcastById } from '../../../Podcast/hooks';

interface articleprobs {
    article: Article;
}

const ArticleNormal: React.FC<articleprobs> = ({ article }) => {
    const { isCognitiveMode } = useContext(CognitiveModeContext);
    const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
    const { mutate } = useUpdateArticle();
    const { data: podcastData } = useGetPodcastById(article.podcastId || "");
    const podcast = podcastData?.data;

    // Audio controls for the podcast
    const { 
        isPlaying, 
        togglePlay, 
        currentTrack 
    } = useAudioControls(podcast ? {
        id: podcast.id,
        title: podcast.title,
        url: podcast.audio.url,
        thumbnail: podcast.thumbnailUrl,
        author: podcast.author?.name,
    } : undefined);

    const toggleCommentSection = () => {
        setIsCommentSectionOpen(!isCommentSectionOpen);
    };

    useEffect(() => {
        mutate({
            articleId: article._id || '',
            article: {
                impression_count: article.impression_count! + 1,
            }
        })
    }, [article, mutate]);

    const handlePodcastPlay = () => {
        if (!podcast) return;
        togglePlay();
    };

    if (!article) {
        return <div>Empty Article</div>;
    }

    return (
        <div className="mt-5 shadow-md p-2 max-w-2xl bg-background">
            <BlogArticleProfile
                title={article.title || ''}
                user={article.author_id || {}}
                content={article.content || ''}
                date={article.createdAt || ''}
                article_id={article._id || ''}
                isArticle={article.isArticle || false}
                article={article}
            />
                 <div className="m-4 border-[1px] border-neutral-500 rounded-sm">
    
    
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            void error;
            void info;
          }}
        >
          {!isCognitiveMode && article?.media && (
            <BlogArticleImagery article={article} media={article.media} />
          )}
        </ErrorBoundary>
        <BlogArticleMessage
          title={article.title || ""}
          content={article.content || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          slug={article.slug || ""}
          article={article}
        />
        <div className="flex p-3 gap-1 items-center">
          {article.hasPodcast && (
            <>
              <button 
                onClick={handlePodcastPlay}
                className={`p-2 rounded-full ${currentTrack?.id === podcast?.id && isPlaying ? 'bg-main-green' : 'bg-neutral-700'}`}
              >
                <LuMic size={18} className={currentTrack?.id === podcast?.id && isPlaying ? 'text-white' : 'text-neutral-300'} />
              </button>
              <div className="size-1 rounded-full bg-primary-400"></div>
            </>
          )}
          <div className="text-neutral-70 text-xs mx-1">
            {calculateReadTime(article.content || '', article.media || [])} mins Read
          </div>
        </div>
      </div>
            <BlogArticleReactionStats
                toggleCommentSection={toggleCommentSection}
                date={article.createdAt || ''}
                article_id={article._id || ''}
                article={article}
                author_of_post={article.author_id!}
            />
        </div>
    )
}

export default ArticleNormal;