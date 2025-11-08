import React, { useContext, useEffect, useState } from 'react';
import { Article } from '../../../../models/datamodels';
import { ErrorBoundary } from 'react-error-boundary';
import { useUpdateArticle } from '../../hooks/useArticleHook';
import { CognitiveModeContext } from '../../../../context/CognitiveMode/CognitiveModeContext';
import ErrorFallback from '../../../../components/molecules/ErrorFallback/ErrorFallback';
import BlogArticleProfile from '../BlogComponents/BlogArticleProfile';
import BlogArticleImagery from '../BlogComponents/BlogArticleImagery';
import BlogArticleMessage from '../BlogComponents/BlogArticleMessage';
//import BlogArticleReactionStats from '../BlogComponents/BlogArticleReactionStats';
import { calculateReadTime } from '../../../../utils/articles';

import PodcastPlayer from '../BlogComponents/PodcastPlayer';
import BlogReactionSession from '../BlogComponents/BlogReactionSession';
import { useGetReadingProgressByArticleId } from '../../../ReadingProgress/hooks';
import { useUser } from '../../../../hooks/useUser';
import { useLocation } from 'react-router-dom';

interface articleprobs {
    article: Article;
}

const ArticleNormal: React.FC<articleprobs> = ({ article }) => {
    const { isCognitiveMode } = useContext(CognitiveModeContext);
    const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
    const { mutate } = useUpdateArticle();
    
    // Reading progress data
    const { isLoggedIn } = useUser();
    const location = useLocation();
    const { data: readingProgress } = useGetReadingProgressByArticleId(article._id || "");
    const progressPercentage = readingProgress?.data?.scroll_length || 0;
    
    // Only show progress on bookmarks page
    const isBookmarksPage = location.pathname === '/bookmarks';

    const toggleCommentSection = () => {
        setIsCommentSectionOpen(!isCommentSectionOpen);
    };

    useEffect(() => {
        mutate({
            articleId: article._id || '',
            article: {
                impression_count: (article.impression_count || 0) + 1,
            }
        })
    }, [article, mutate]);

    if (!article) {
        return <div>Empty Article</div>;
    }

    return (
        <div className="mt-5 border-[1px] border-neutral-500 p-2 md:p-4 max-w-2xl bg-background rounded-3xl ">
            <BlogArticleProfile
                title={article.title || ''}
                user={article.author_id || article.author || {}}
                content={article.content || ''}
                date={article.createdAt || ''}
                article_id={article._id || ''}
                isArticle={article.isArticle || false}
                article={article}
            />

          {/* <div className='p-3'>
            <div className='w-full flex items-center justify-between gap-2 bg-primary-400 rounded-lg p-2'>
                <div className='flex items-center gap-2'>
                    <div className='text-neutral-70 text-xs mx-1'>
                        {calculateReadTime(article.content || '', article.media || [])} mins Read
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='text-neutral-70 text-xs mx-1'>
                        {calculateReadTime(article.content || '', article.media || [])} mins Read
                    </div>
                </div>

            </div>
            </div> */}
            
           {/* Podcast Player */}
            {article.hasPodcast && (
                <PodcastPlayer podcastId={article.podcastId} articleId={article._id} />
            )}

            <div className='m-4 border-[1px] border-neutral-500  rounded-3xl'>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onError={(error, info) => {
                        void error;
                        void info;
                    }}>
                    {!isCognitiveMode && article?.media && <BlogArticleImagery article={article} media={article.media} />}
                </ErrorBoundary>
                <BlogArticleMessage
                    title={article.title || ''}
                    content={article.content || ''}
                    article_id={article._id || ''}
                    isArticle={article.isArticle || false}
                    slug={article.slug || ''}
                    article={article}
                />
                <div className='flex p-3 gap-1 items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <div className="text-neutral-70 text-xs mx-1">
                            {calculateReadTime(article.content || '', article.media || [])} mins Read
                        </div>
                    </div>
                    
                    {/* Reading Progress Indicator - Only on Bookmarks page */}
                    {isLoggedIn && progressPercentage > 0 && isBookmarksPage && (
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary-400 transition-all duration-300 ease-out"
                                    style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                                />
                            </div>
                            <span className="text-primary-400 text-xs font-medium min-w-[2.5rem] text-right">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
       
       <div className='px-4 md:px-4'>
             <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={article.content || ""}
        article_id={article._id || ""}
        setIsCommentSectionOpen={toggleCommentSection}
        author_of_post={article.author_id || {}}
        text_to_speech={article.text_to_speech || ""}
        article={article}
        />
        </div>
        </div>
    )
}

export default ArticleNormal;