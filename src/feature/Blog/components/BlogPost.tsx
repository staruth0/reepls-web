import React, { useContext, useState } from 'react';
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

interface BlogPostProps {
  article: Article;
}

const BlogPost: React.FC<BlogPostProps> = ({ article }) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <div
      className={`each_blog_post mt-5 shadow-sm p-2 max-w-[680px]  self-center w-full bg-background`}>
      {article.isArticle && <BlogArticleHeader />}
      <BlogProfile
        title={article.title || ''}
        user={article.author_id || {}}
        content={article.content || ''}
        date={article.createdAt || ''}
        article_id={article._id || ''}
        isArticle={article.isArticle || false}
      />
      <BlogMessage
        title={article.title || ''}
        content={article.content || ''}
        article_id={article._id || ''}
        isArticle={article.isArticle || false}
        slug={article.slug || ''}
      />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error('Error caught by ErrorBoundary:', error, info);
        }}>
        {!isCognitiveMode && article?.media && <BlogImagery media={article.media} />}
      </ErrorBoundary>

      <BlogReactionStats
        toggleCommentSection={toggleCommentSection}
        date={article.createdAt || ''}
        article_id={article._id || ''}
      />
      <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={article.content || ''}
        article_id={article._id || ''}
        setIsCommentSectionOpen={toggleCommentSection}
        author_of_post={article.author_id || {}}
        text_to_speech={article.text_to_speech || ''}
      />
    </div>
  );
};

export default BlogPost;
