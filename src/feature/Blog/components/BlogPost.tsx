import React, { useContext, useState } from "react";
import { CognitiveModeContext } from "../../../context/CognitiveMode/CognitiveModeContext";
import BlogImagery from "./BlogComponents/BlogImagery";
import BlogMessage from "./BlogComponents/BlogMessage";
import BlogProfile from "./BlogComponents/BlogProfile";
import BlogReactionSession from "./BlogComponents/BlogReactionSession";
import BlogReactionStats from "./BlogComponents/BlogReactionStats";
import BlogArticleHeader from "./BlogArticleHeader";


interface BlogPostProps {
  images: string[];
  title: string;
  content: string;
  id: string;
  date: string;
  isArticle: boolean;
  article_id: string;
}

const sampleImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
const BlogPost: React.FC<BlogPostProps> = ({images,title,content,id,date,isArticle,article_id}) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(false);
  
  

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  return (
    <div className="each_blog_post mt-5 shadow-md p-2 max-w-[680px] self-center w-full">
      { isArticle && <BlogArticleHeader /> }
      <BlogProfile id={id} date={date} />
      <BlogMessage title={title} content={content} />
      {!isCognitiveMode && <BlogImagery PostImages={sampleImages} />}
      <BlogReactionStats
        toggleCommentSection={toggleCommentSection}
        date={date}
      />
      <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={content}
        article_id={article_id}
      />
    </div>
  );
};

export default BlogPost;
