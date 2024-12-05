import React, { useContext } from 'react'
import BlogProfile from '../atoms/BlogProfile'
import BlogMessage from '../atoms/BlogMessage'
import BlogImagery from '../atoms/BlogImagery'
import BlogReactionStats from '../atoms/BlogReactionStats'
import BlogReactionSession from '../atoms/BlogReactionSession'
import './index.scss'
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext'

const BlogComponent: React.FC = () => {
  const {isCognitiveMode} = useContext(CognitiveModeContext)
  
  return (
    <div className="blog__component">
      <div className="each_blog_post">
        <BlogProfile />
        <BlogMessage />
        {!isCognitiveMode && <BlogImagery />}

        <BlogReactionStats />
        <BlogReactionSession />
      </div>
      <div className="each_blog_post">
        <BlogProfile />
        <BlogMessage />
        {!isCognitiveMode && <BlogImagery />}

        <BlogReactionStats />
        <BlogReactionSession />
      </div>
      
    </div>
  );
}

export default BlogComponent