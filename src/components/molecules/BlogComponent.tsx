import React from 'react'
import BlogProfile from '../atoms/BlogProfile'
import BlogMessage from '../atoms/BlogMessage'
import BlogImagery from '../atoms/BlogImagery'
import BlogReactionStats from '../atoms/BlogReactionStats'
import BlogReactionSession from '../atoms/BlogReactionSession'
import './index.scss'

const BlogComponent:React.FC = () => {
  return (
    <div className="blog__component">
      <div className="each_blog_post">
        <BlogProfile />
        <BlogMessage />
        <BlogImagery />
        <BlogReactionStats />
        <BlogReactionSession />
      </div>
      <div className="each_blog_post">
        <BlogProfile />
        <BlogMessage />
        <BlogImagery />
        <BlogReactionStats />
        <BlogReactionSession />
      </div>
      <div className="each_blog_post">
        <BlogProfile />
        <BlogMessage />
        <BlogImagery />
        <BlogReactionStats />
        <BlogReactionSession />
      </div>
    </div>
  );
}

export default BlogComponent