import React, { useContext } from 'react';
import BlogProfile from '../atoms/BlogComponents/BlogProfile';
import BlogMessage from '../atoms/BlogComponents/BlogMessage';
import BlogImagery from '../atoms/BlogComponents/BlogImagery';
import BlogReactionStats from '../atoms/BlogComponents/BlogReactionStats';
import BlogReactionSession from '../atoms/BlogComponents/BlogReactionSession';
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext';
import './index.scss';

const BlogPost: React.FC = () => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);

  return (
    <div className="each_blog_post">
      <BlogProfile />
      <BlogMessage />
      {!isCognitiveMode && <BlogImagery />}
      <BlogReactionStats />
      <BlogReactionSession />
    </div>
  );
};

export default BlogPost; 