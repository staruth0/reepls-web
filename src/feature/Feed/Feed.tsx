import React, { useState } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import Communique from "./components/Communique/Communique";
import Tabs from "../../components/molecules/Tabs/Tabs";
import BlogPost from "../../components/molecules/BlogPost";
import { useGetAllArticles } from "../Blog/hooks/useArticleHook";
import "./feed.scss";

const tabs = [
  { id: 1, title: "For you" },
  { id: 2, title: "Following" },
];

const UserFeed: React.FC = () => {
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  const { data, error, isLoading } = useGetAllArticles();
  
  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
    console.log(data.articles)
  }


  return (
    <div
      className={`lg:grid ${
        isExpandedMode ? "grid-cols-[4fr_1.25fr]" : "grid-cols-[4fr_1.66fr]"
      } `}
    >
      {/* Feed Posts Section */}
      <div className="Feed__Posts lg:border-r-[1px] border-neutral-500 ">
        <Topbar>
          <div className="w-[200px] px-3">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
            />
          </div>
        </Topbar>
        {/* Blog Posts */}

      { isLoading? <div>Loading...</div>:<div className="px-1 sm:px-10 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse gap-7 ">
          {
            data?.articles.map((article:any) => (
              <BlogPost key={article.id} images={article.media} title={article.title} content={article.content} id={article.author_id} date={article.createdAt} />
            ))
         }
        </div>
        }
        {error && <div>Error: {error.message}</div>}
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique
          isExpandedMode={isExpandedMode}
          handleExpandedMode={handleExpandedMode}
        />
      </div>
    </div>
  );
};

export default UserFeed;
