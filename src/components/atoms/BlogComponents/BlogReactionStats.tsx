import React from "react";
import "./Blog.scss";
import { hand5, heart, thumb } from "../../../assets/icons";


const BlogReactionStats: React.FC = () => {
  return (
    <div className="blog-reaction-stats">
      <div className="icons">
        <div className="icons-count-wrapper">
          <div className="icon-wrapper">
          <img src={heart} alt="heart" />
          <img src={thumb} alt="thumb" />
          <img src={hand5} alt="hand" />
        </div>
        <div className="reaction-count">
          1.1k
        </div>
        </div>
        <div className="comment-count">
          57 Comments
        </div>
      </div>
      <div className="time-posted">
        3 mins read
      </div>
    </div>
  );
};

export default BlogReactionStats;
