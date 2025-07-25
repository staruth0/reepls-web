import React, { useContext, useEffect, useState } from 'react'
import { Article } from '../../../../models/datamodels';
// import BlogProfile from '../BlogComponents/BlogProfile';
import { ErrorBoundary } from 'react-error-boundary';
import BlogImagery from '../BlogComponents/BlogImagery';
import BlogMessage from '../BlogComponents/BlogMessage';
import BlogReactionStats from '../BlogComponents/BlogReactionStats';
import BlogReactionSession from '../BlogComponents/BlogReactionSession';
import { useUpdateArticle } from '../../hooks/useArticleHook';
import { CognitiveModeContext } from '../../../../context/CognitiveMode/CognitiveModeContext';
import ErrorFallback from '../../../../components/molecules/ErrorFallback/ErrorFallback';
import BlogArticleProfileRepost from '../BlogComponents/BlogArticleProfileRepost';
import BlogArticleProfileNoComment from '../BlogComponents/BlogArticleProfileNocommentary';
import { useGetUserByUsername } from '../../../Profile/hooks';

interface articleprobs {
    article:Article;
}

const PostNormalNoCommentary:React.FC<articleprobs> = ({article}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
    const {mutate} = useUpdateArticle()
     const {user} = useGetUserByUsername(article.repost?.repost_user.username || '')

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
     <div className=" mb-2 mx-2  py-4">
      
          <BlogArticleProfileNoComment           title={article.title || ""}
            user={user || {}}
            content={article.content || ""}
            date={article.createdAt || ""}
            article_id={article._id || ""}
            isArticle={article.isArticle || false}
            article={article}
          />
        </div>
       
       <div className="m-2 border-[1px] border-neutral-500 rounded-sm">
        <BlogArticleProfileRepost
          title={article.title || ""}
          user={article.author_id || {}}
          content={article.content || ""}
          date={article.createdAt || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          article={article}
        />

        <BlogMessage
          title={article.title || ""}
          content={article.content || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          slug={article.slug || ""}
          article={article}
        />

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            void error;
            void info;
          }}
        >
          {!isCognitiveMode && article?.media && (
            <BlogImagery article={article} media={article.media} />
          )}
        </ErrorBoundary>
      </div>
     

      <BlogReactionStats
        toggleCommentSection={toggleCommentSection}
        date={article.createdAt || ''}
        article_id={article._id || ''}
        article={article}
      />
      <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={article.content || ''}
        article_id={article._id || ''}
        setIsCommentSectionOpen={toggleCommentSection}
        author_of_post={article.author_id || {}}
        text_to_speech={article.text_to_speech || ''}
        article={article}
      />
    </>
  )
}

export default PostNormalNoCommentary
