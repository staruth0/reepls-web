import React, { useContext, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../../components/molecules/ErrorFallback/ErrorFallback';
import { CognitiveModeContext } from '../../../context/CognitiveMode/CognitiveModeContext';
import { Article } from '../../../models/datamodels';
import BlogArticleHeader from './BlogArticleHeader';
import BlogImagery from './BlogComponents/BlogImagery';
import BlogMessage from './BlogComponents/BlogMessage';
import BlogProfile from './BlogComponents/BlogProfile';
import BlogReactionSession from './BlogComponents/BlogReactionSession';
import BlogReactionStats from './BlogComponents/BlogReactionStats';
import { useUpdateArticle } from '../hooks/useArticleHook';

interface BlogPostProps {
  article: Article;
  isModalView?: boolean;
  onClose?: () => void;
}

const BlogPost2: React.FC<BlogPostProps> = ({ article, isModalView = false }) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
  const { mutate } = useUpdateArticle();

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  useEffect(() => {
    mutate({
      articleId: article._id || '',
      article: {
        impression_count: article.impression_count! + 1,
      }
    });
  }, [article, mutate]);

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <div className={`each_blog_post ${isModalView ? 'modal-view' : ''}`}>
      {isModalView && (
     <></>
      )}
      
      {article.isArticle && <BlogArticleHeader />}
      <BlogProfile
        title={article.title || ''}
        user={article.author_id || {}}
        content={article.content || ''}
        date={article.createdAt || ''}
        article_id={article._id || ''}
        isArticle={article.isArticle || false}
        article={article}
      />
      <BlogMessage
        title={article.title || ''}
        content={article.content || ''}
        article_id={article._id || ''}
        isArticle={article.isArticle || false}
        slug={article.slug || ''}
        article={article}
      />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          void {error, info};
        }}>
        {!isCognitiveMode && article?.media && <BlogImagery article={article} media={article.media} />}
      </ErrorBoundary>

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
    </div>
  );
};

export default BlogPost2;