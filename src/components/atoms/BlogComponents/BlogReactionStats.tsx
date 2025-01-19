import React from "react";
import { hand5, heart, thumb } from "../../../assets/icons";
import { timeAgo } from "../../../utils/dateFormater";

interface BlogReactionStatsProps {
  date: string;
}

const BlogReactionStats: React.FC<BlogReactionStatsProps> = ({ date }) => {
  return (
    <div className="flex justify-between items-center p-4 text-neutral-50 text-sm font-roboto">
      {/* Reaction Section */}
      <div className="flex items-center gap-2 h-[30px] relative cursor-pointer">
        <div className="flex gap-0 items-center">
          {/* Stacked Icons */}
          <div className="flex relative">
            <img
              src={heart}
              alt="heart"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-10 -ml-1"
            />
            <img
              src={thumb}
              alt="thumb"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-20 -ml-2"
            />
            <img
              src={hand5}
              alt="hand"
              className="w-5 h-5 rounded-full shadow-md transform transition-transform  relative z-30 -ml-2"
            />
          </div>
          {/* Reaction Count */}
          <div className="ml-1">1.1k</div>
        </div>

        {/* Comments Count */}
        <div className="ml-4 text-neutral-70">57 Comments</div>
      </div>

      {/* Time Posted */}
      <div className="text-neutral-70 text-xs">{timeAgo(date)}</div>
    </div>
  );
};

export default BlogReactionStats;
