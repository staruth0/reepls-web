import React, { useState } from "react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import Communique from "../../Feed/components/Communique/Communique";
import SearchTopBar from "../components/SearchTopBar";

const tabs = [
  { id: "Topics", title: "Topics" },
  { id: "Recent", title: "Recent" },
  { id: "People", title: "People" },
];

const topics = [
  "politics",
  "journalism",
  "tech",
  "art",
  "history",
  "culture",
  "film",
  "crime",
];
const articles = [
  "Anglophone crisis",
  "Angel investments 2024",
  "Anglophone journalists",
];

const Search: React.FC = () => {
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
  }

  return (
    <div
      className={`grid font-roboto  ${
        isExpandedMode ? "grid-cols-[4fr_1.25fr]" : "grid-cols-[4fr_1.66fr]"
      } `}
    >
      
      <div className="search border-r-[1px] border-neutral-500 ">
        <Topbar>
          <SearchTopBar/>
        </Topbar>
        <div className="px-20 flex flex-col">
          <div className="mt-10 w-[45%] self-center">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
            />
          </div>
        
            <div className="mt-8 text-[15px]">
              {activeTab === "Topics" && (
                <div className="flex flex-wrap gap-x-3 gap-y-2  ">
                  {topics.map((topic) => (
                    <span key={topic} className="py-2 px-6 text-neutral-100 rounded-full border-[1px] border-neutral-500 hover:border-none hover:bg-primary-400 hover:text-white transition-all transition-300 cursor-pointer ">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
              {activeTab === "Recent" && (
                <div className="recent">
                  {articles.map((article) => (
                    <p key={article}>{article}</p>
                  ))}
                </div>
              )}
              {activeTab === "People" && (
                <div className="people">
                  <p>No people suggestions yet.</p>
                </div>
              )}
            </div>
        
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique flex flex-col">
        <Communique
          isExpandedMode={isExpandedMode}
          handleExpandedMode={handleExpandedMode}
        />
      </div>
    </div>
  );
};

export default Search;
