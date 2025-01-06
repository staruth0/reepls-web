import React, { useState } from "react";
import "../styles/search.scss";

const Search: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Topics");

  const tabs = ["Recent", "Topics", "People"];
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

  const getSliderStyle = () => {
    const index = tabs.indexOf(activeTab);
    return {
      left: `${index * 33.33}%`,
    };
  };

  return (
    <div className="search-container">
    
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="slider" style={getSliderStyle()}></div>
      </div>

     
      <div className="content">
        {activeTab === "Topics" && (
          <div className="topics">
            {topics.map((topic) => (
              <span key={topic} className="topic">
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
  );
};

export default Search;



//  <div className="content">
//    {activeTab === "Topics" && (
//      <div className="topics">
//        {topics.map((topic) => (
//          <span key={topic} className="topic">
//            {topic}
//          </span>
//        ))}
//      </div>
//    )}
//    {activeTab === "Recent" && (
//      <div className="recent">
//        {articles.map((article) => (
//          <p key={article}>{article}</p>
//        ))}
//      </div>
//    )}
//    {activeTab === "People" && (
//      <div className="people">
//        <p>No people suggestions yet.</p>
//      </div>
//    )}
//  </div>;