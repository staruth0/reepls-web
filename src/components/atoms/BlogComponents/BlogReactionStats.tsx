import React from "react";
import "./Blog.scss";
import { hand5, heart, thumb } from "../../../assets/icons";
import { timeAgo } from "../../../utils/dateFormater";


interface BlogReactionStatsProps { 
  date: string;
}

const BlogReactionStats: React.FC<BlogReactionStatsProps> = ({date}) => {

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
        {timeAgo(date)}
      </div>
    </div>
  );
};

export default BlogReactionStats;
