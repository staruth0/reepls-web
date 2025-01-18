import React, { useState } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import BlogComponent from "../../components/molecules/BlogComponent";
import Communique from "./components/Communique/Communique";

import "./feed.scss";
import Tabs from "../../components/molecules/Tabs/Tabs";


const tabs = [
  { id: 1, title: "For you" },
  { id: 2, title: "Following" },
];

const UserFeed:React.FC = () => {
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);


  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
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
        <div className="px-1 sm:px-20">
          <BlogComponent />
        </div>
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
