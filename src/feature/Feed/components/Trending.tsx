import React, { useState } from "react";
import { ArrowRight, TrendingUp, Users } from "lucide-react"; // Import Users icon
import TrendingLink from "./TrendingLink";
import AuthorSuggestions from "./AuthorSuggestions";
import { useGetTrendingTopics } from "../hooks";
import TrendingTopicsSkeleton from "../../../components/atoms/TrendingTopicsSkeleton";
import { useTranslation } from "react-i18next";

const Trending: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isLoading } = useGetTrendingTopics();
  const { t } = useTranslation();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if there are trending topics
  const hasTrendingTopics = data?.data?.length > 0;

  // Determine if the "See More/See Less" button should be visible
  // This is a heuristic. You might need to adjust the 'threshold' based on your layout and average topic length.
  // For simplicity, let's assume if there are more than 6 topics, it's likely to overflow.
  // A more robust solution might involve measuring the actual height.
  const showSeeMoreButton = data && data.data && data.data.length > 6; // Adjust this number as needed

  return (
    <div className="w-full flex flex-col gap-3 px-6 py-1 sticky top-0">
      {/* Trending Section - Only shown if there are trending topics or loading */}
      {(isLoading || hasTrendingTopics) && (
        <>
          <div className="text-neutral-100 text-[15px] font-semibold my-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-yellow-500" />
            <span>{t("TRENDING ON REEPLS")}</span>
          </div>

          {isLoading ? (
            <TrendingTopicsSkeleton />
          ) : (
            <>
              <div
                className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${
                  isExpanded ? "max-h-[500px]" : "max-h-[100px]"
                }`}
              >
                {data?.data?.map((topic: string) => (
                  <TrendingLink key={topic} title={topic} />
                ))}
              </div>

              {/* Only show "See More/See Less" button if there are enough topics to warrant it */}
              {showSeeMoreButton && (
                <div
                  className="flex justify-center items-center text-[14px] py-2 text-neutral-50 gap-1 cursor-pointer hover:text-primary-400 transition-colors duration-200"
                  onClick={toggleExpand}
                >
                  <span>{isExpanded ? t("feed.seeLess") : t("feed.seeMore")}</span>
                  <ArrowRight
                    size={18}
                    className={`transition-transform duration-300 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

     
      <div className="mt-2">
        {/* Added Users icon with matching styling */}
        <div className="text-neutral-100 text-[15px] font-semibold mt-1 p-1 flex items-center gap-2">
          <Users size={20} className="text-yellow-500" />
          <span>{t("REEPLS SUGGESTIONS")}</span>
        </div>
        <AuthorSuggestions />
      </div>
    </div>
  );
};

export default Trending;