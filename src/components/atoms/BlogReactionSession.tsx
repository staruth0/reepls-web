import React from "react";
import "./Blog.scss";
import { readAloudIcon, thumb_2, tooltip } from "../../assets/icons";

const BlogReactionSession: React.FC = () => {
  return (
    <div className="blog-reaction-session">
      <button>
        <img src={thumb_2} alt="thumb" /> React
      </button>
      <button>
        <img src={tooltip} alt="" /> Comment
      </button>
      <button>
        <img src={readAloudIcon} alt="" /> Read Aloud
      </button>
    </div>
  );
};

export default BlogReactionSession;
