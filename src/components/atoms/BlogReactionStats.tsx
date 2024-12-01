
import React from "react";
import "./Blog.scss";
import { hand5, heart, thumb } from "../../assets/icons";

const BlogReactionStats: React.FC = () => {
  return (
    <div className="blog-reaction-stats">
      <div className="icons">
        <div>
          <img src={heart} alt="heart" />
          <img src={thumb} alt="thumb" />
          <img src={hand5} alt="hand" />
        </div>
        <div>
          1.1 k
        </div>
        <div>
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
