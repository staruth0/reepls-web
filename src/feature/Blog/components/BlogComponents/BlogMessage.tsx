import React, { useState } from "react";
import "./Blog.scss";
import { useNavigate } from "react-router-dom";

interface BlogMessageProps {
  title: string;
  content: string;
  isArticle: boolean;
  article_id: string;
}

const BlogMessage: React.FC<BlogMessageProps> = ({ title, content,isArticle,article_id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate()

  const handleToggle = () => {
    if (isArticle) {
      navigate(`/posts/article/${article_id}`);
    } else {
      setIsExpanded((prev) => !prev);
    }
    
  }

  return (
    <div className="blog-message">
      <div className="text-[15px] font-semibold mb-2">{title}</div>
      <p
        className={`text-neutral-100 text-[14px] leading-[20px] transition-all duration-300 ${isExpanded ? "line-clamp-none" : "line-clamp-3"}`}
      >
        {content}
      </p>
      <button onClick={handleToggle} className="text-neutral-50 text-[15px] font-medium mt-1">
        {isExpanded ? "See less" : "See more"}
      </button>
    </div>
  );
};

export default BlogMessage;
