import React, { useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import TrendingLink from "./TrendingLink";
import AuthorSuggestions from "./AuthorSuggestions";
import { useGetTrendingTopics } from "../hooks";
import TrendingTopicsSkeleton from "../../../components/atoms/TrendingTopicsSkeleton";


const Trending: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {data, isLoading} = useGetTrendingTopics()

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full flex flex-col gap-3 px-6 py-1 sticky top-0">
      <div className="text-neutral-100 text-md font-semibold my-2 mb-2 flex items-center gap-2">
        <TrendingUp size={20} className="text-yellow-500" />
        <span>Trending</span>
      </div>

   { isLoading ?<TrendingTopicsSkeleton/> : <>   <div
        className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px]" : "max-h-[100px]"
        }`}
      >
        {data?.data?.map((topic:string) => (
          <TrendingLink key={topic} title={topic} />
        ))}
      </div>

      <div
        className="flex justify-center items-center text-[14px] py-2 text-neutral-50 gap-1 cursor-pointer"
        onClick={toggleExpand}
      >
        <span>{isExpanded ? "See less" : "See more"}</span>
        <ArrowRight
          size={18}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </div></>}

      <div>
        <div className="text-neutral-50 mt-1 font-semibold text-[15px]">
          REEPLS SUGGESTIONS
        </div>
        <AuthorSuggestions />
      </div>
    </div>
  );
};

export default Trending;
