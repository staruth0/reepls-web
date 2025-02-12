import React, { useState } from "react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import Communique from "../../Feed/components/Communique/Communique";
import SearchTopBar from "../components/SearchTopBar";
import SearchTopics from "./SearchTopics";
import SearchRecent from "./SearchRecent";
import SearchPeople from "./SearchPeople";

const tabs = [
  { id: "Topics", title: "Topics" },
  { id: "Recent", title: "Recent" },
  { id: "People", title: "People" },
];



const Search: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);


  return (
    <div className={`grid font-roboto grid-cols-[4fr_1.65fr]`}>
      <div className="search border-r-[1px] border-neutral-500 ">
        <Topbar>
          <SearchTopBar />
        </Topbar>
        <div className="px-20 flex flex-col min-h-screen">
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
               <SearchTopics/>
            )}
            {activeTab === "Recent" && (
             <SearchRecent/>
            )}
            {activeTab === "People" && (
             <SearchPeople/>
            )}
          </div>
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique  hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default Search;
