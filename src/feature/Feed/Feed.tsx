import { Brain } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import BlogPost from "../Blog/components/BlogPost";
import Tabs from "../../components/molecules/Tabs/Tabs";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";
import {
  useGetAllArticles,
  useGetFollowedArticles,
} from "../Blog/hooks/useArticleHook";
import Communique from "./components/Communique/Communique";
import "./feed.scss";

// Tabs configuration
const tabs = [
  { id: 1, title: "For you" },
  { id: 2, title: "Following" },
];

const UserFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
  const { toggleCognitiveMode } = useContext(CognitiveModeContext);

  // Fetch all articles and followed articles
  const { data, error, isLoading } = useGetAllArticles();
  const {
    data: followedData,
    error: followedError,
    isLoading: followedIsLoading,
  } = useGetFollowedArticles();

  // Function to handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  // Select data based on the active tab
  const displayData = activeTab === 1 ? data : followedData;
  const isDataLoading = activeTab === 1 ? isLoading : followedIsLoading;
  const displayError = activeTab === 1 ? error : followedError;

  useEffect(() => {
    console.log("Data:", followedData);
    console.log("Received Data:", data);
  }, [followedData, data]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500 ">
        <Topbar>
          <div className="px-3 flex justify-between items-center">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
            />
            <Brain
              size={isBrainActive ? 35 : 30}
              onClick={handleBrainClick}
              className={`cursor-pointer transition-all ${
                isBrainActive
                  ? "text-green-600 bg-green-100 rounded-full p-1"
                  : "text-neutral-50 hover:text-green-600 hover:bg-green-100 hover:rounded-full hover:p-1 transition-all"
              }`}
            />
          </div>
        </Topbar>

        {/* Display Skeleton or Articles */}
        {isDataLoading ? (
          <div className="skeleton-loader">Loading</div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse gap-7 ">
            {displayData?.articles?.map((article) => (
              <BlogPost
                key={article._id}
                isArticle={article.isArticle}
                images={article.media}
                title={article.title}
                content={article.content}
                id={article.author_id}
                date={article.createdAt}
                article_id={article._id}
              />
            ))}
          </div>
        )}
        {displayError && <div>Error: {displayError.message}</div>}
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default UserFeed;
