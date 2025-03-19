import React, { useContext, useEffect, useState } from 'react';
import { CognitiveModeContext } from '../../../context/CognitiveMode/CognitiveModeContext';
import { User } from '../../../models/datamodels';
import BlogArticleHeader from './BlogArticleHeader';
import BlogImagery from './BlogComponents/BlogImagery';
import BlogMessage from './BlogComponents/BlogMessage';
import BlogProfile from './BlogComponents/BlogProfile';
import BlogReactionSession from './BlogComponents/BlogReactionSession';
import BlogReactionStats from './BlogComponents/BlogReactionStats';

interface BlogPostProps {
  media: string[];
  title: string;
  subtitle?: string;
  content: string;
  date: string;
  isArticle: boolean;
  article_id: string;
  user: User;
  slug: string;
}

// const sampleImages = [
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// ];

const BlogPost: React.FC<BlogPostProps> = ({
  media,
  title,
  subtitle,
  content,
  date,
  isArticle,
  article_id,
  user,
  slug,
}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  useEffect(()=>{
    console.log('user',user)
  },[user])

  return (
    <div className="each_blog_post mt-5 shadow-md p-2 max-w-[680px] self-center w-full bg-background">
      {isArticle && <BlogArticleHeader />}
      <BlogProfile
        title={title}
        user={user}
        content={content}
        date={date}
        article_id={article_id}
        isArticle={isArticle}
      />
      <BlogMessage
        title={title}
        content={isArticle ? subtitle ?? '' : content}
        article_id={article_id}
        isArticle={isArticle}
        slug={slug}
      />
      {!isCognitiveMode && media.length > 0 && <BlogImagery media={media} />}
      <BlogReactionStats toggleCommentSection={toggleCommentSection} date={date} article_id={article_id} />
      <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={content}
        article_id={article_id}
        setIsCommentSectionOpen={toggleCommentSection}
        author_of_post={user}
      />
    </div>
  );
};

export default BlogPost;
