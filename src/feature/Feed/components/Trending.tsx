import React from "react";
import { TrendingUp } from "lucide-react";
import TrendingLink from "./TrendingLink";
import SeeMore from "./SeeMore";

const TrendingTopics = [
  "Politics",
  "Anglophone Crisis",
  "Economic Crisis",
  "Election 2025",
];

const Trending: React.FC = () => {
  return (
    <div className="border-t-[.5px] w-full border-neutral-500 flex flex-col gap-3 px-6 py-1 sticky top-0">
      
      <div className="text-neutral-100 text-md font-semibold my-2 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-yellow-500" />
        <span>Trending</span>
      </div>

     
      {TrendingTopics.map((topic, index) => (
        <TrendingLink key={index} title={topic} />
      ))}

      <SeeMore />
    </div>
  );
};

export default Trending;
