import React, { useState } from "react";
import "./Blog.scss";

interface BlogMessageProps {
  title: string;
  content: string;
}

const BlogMessage: React.FC<BlogMessageProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className="blog-message">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p
        className={`text-neutral-50 text-[14px] transition-all duration-300 ${
          isExpanded ? "line-clamp-none" : "line-clamp-3"
        }`}
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
