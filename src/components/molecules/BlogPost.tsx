import React, { useContext } from 'react';
import BlogProfile from '../atoms/BlogComponents/BlogProfile';
import BlogMessage from '../atoms/BlogComponents/BlogMessage';
import BlogImagery from '../atoms/BlogComponents/BlogImagery';
import BlogReactionStats from '../atoms/BlogComponents/BlogReactionStats';
import BlogReactionSession from '../atoms/BlogComponents/BlogReactionSession';
import { CognitiveModeContext } from '../../context/CognitiveMode/CognitiveModeContext';
import './index.scss';

interface BlogPostProps { 
  images: string[]; 
  title: string; 
  content: string;
  id: string
  date: string
  
}


const BlogPost: React.FC<BlogPostProps> = ({ images,title ,content,id,date}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);

  return (
    <div className="each_blog_post mt-5 shadow-md p-2">
      <BlogProfile id={id}  date={date}/>
      <BlogMessage title={title} content={ content} />
      {!isCognitiveMode && <BlogImagery PostImages={images} />}
      <BlogReactionStats date={date} />
      <BlogReactionSession />
    </div>
  );
};

export default BlogPost; 