import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.scss';
interface BlogMessageProps {
  title: string;
  content: string;
  isArticle: boolean;
  article_id: string;
  slug?:string;
}

const BlogMessage: React.FC<BlogMessageProps> = ({ title, content, isArticle, article_id,slug }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    if (isArticle) {
      navigate(`${slug? `/posts/article/slug/${slug}`: `/posts/article/${article_id}`}`);
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className="blog-message">
      <div className="text-[15px] font-semibold mb-2">{title}</div>
      <p
        className={`text-neutral-100 text-[14px] leading-[20px] transition-all duration-300 ${
          isExpanded ? 'line-clamp-none' : 'line-clamp-3'
        }`}>
        {content}
      </p>
      {isArticle ? (
        <button
          onClick={handleToggle}
          className="text-primary-400 underline decoration-dotted underline-offset-4 text-[14px] font-medium mt-1 cursor-pointer">
          Continue reading
          {/* <LuArrowRight className="inline-block size-4" /> */}
        </button>
      ) : (
        <button onClick={handleToggle} className="text-neutral-50 text-[14px] font-medium mt-1">
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default BlogMessage;
