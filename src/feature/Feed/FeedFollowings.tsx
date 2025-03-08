import { Brain } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import BlogPost from "../Blog/components/BlogPost";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";
import {
  useGetFollowedArticles,
} from "../Blog/hooks/useArticleHook";
import Communique from "./components/Communique/Communique";
import "./feed.scss";
import BlogSkeletonComponent from "../Blog/components/BlogSkeleton";
import { Article } from "../../models/datamodels";
import ToggleFeed from "./components/ToogleFeed";

const FeedFollowing: React.FC = () => {
  
  const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
    const { toggleCognitiveMode } = useContext(CognitiveModeContext);
    

  const {
    data: followedData,
    error: followedError,
    isLoading: followedIsLoading,
  } = useGetFollowedArticles();

  // Handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };



  useEffect(() => {
    if (followedData) console.log("followeddata", followedData);
  }, [followedData]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center">
            <ToggleFeed/>
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
        {followedIsLoading ? (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse">
            <BlogSkeletonComponent />
            <BlogSkeletonComponent />
          </div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
            {
              followedData?.map((article: Article) => (
                <BlogPost
                  key={article._id}
                  isArticle={article.isArticle!}
                  images={article.media!}
                  title={article.title!}
                  content={article.content!}
                  date={article.createdAt!}
                  article_id={article._id!}
                  user={article.author_id!}
                />
              ))}
          </div>
        )}
              {followedError && <div>{ followedError.message}</div> }
      </div>

      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default FeedFollowing;
