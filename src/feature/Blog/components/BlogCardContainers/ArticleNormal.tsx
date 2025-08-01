import React, { useContext, useEffect, useState } from 'react'
import { Article } from '../../../../models/datamodels';
import { ErrorBoundary } from 'react-error-boundary';
import { useUpdateArticle } from '../../hooks/useArticleHook';
import { CognitiveModeContext } from '../../../../context/CognitiveMode/CognitiveModeContext';
import ErrorFallback from '../../../../components/molecules/ErrorFallback/ErrorFallback';
import BlogArticleProfile from '../BlogComponents/BlogArticleProfile';
import BlogArticleImagery from '../BlogComponents/BlogArticleImagery';
import BlogArticleMessage from '../BlogComponents/BlogArticleMessage';
import BlogArticleReactionStats from '../BlogComponents/BlogArticleReactionStats';
import { ReadingControls } from '../../../../components/atoms/ReadALoud/ReadingControls';
import { calculateReadTime } from '../../../../utils/articles';

interface articleprobs {
    article:Article;
}

const ArticleNormal:React.FC<articleprobs> = ({article}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
    const {mutate} = useUpdateArticle()

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

   useEffect(()=>{
    mutate({
      articleId:article._id || '',
      article:{
        impression_count:article.impression_count! +1,
      }
    })
  },[article,mutate])

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <>
        <BlogArticleProfile
        title={article.title || ''}
        user={article.author_id || {}}
        content={article.content || ''}
        date={article.createdAt || ''}
        article_id={article._id || ''}
        isArticle={article.isArticle || false}
        article={article}

      />
      <div className='m-4 rounded-sm'>
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
      <div className='flex p-3 gap-1 items-center'>
     { article.has_podcast && <> <div className="relative ">
          <ReadingControls article={article} article_id={article.article_id || ''} article_tts={article.text_to_speech || ''} />
        </div>
        <div className='size-1 rounded-full bg-primary-400'> </div></>}
        <div className="text-neutral-70 text-xs mx-1">
        {calculateReadTime(article.content!, article.media || [])} mins Read
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
     
    </>
  )
}

export default ArticleNormal
