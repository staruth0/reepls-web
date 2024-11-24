import React, { useState } from "react";
import BrainIcon from "../../assets/icons/brain.svg";
import "../molecules/top_navbar/topNav.scss";

const TopbarAtom = () => {
  const [activeTab, setActiveTab] = useState("forYou");

  return (
    <div className="top-bar-atom">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "forYou" ? "active" : ""}`}
          onClick={() => setActiveTab("forYou")}
        >
          For you
        </button>
        <button
          className={`tab ${activeTab === "following" ? "active" : ""}`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>
      <div className="icon">
        <img src={BrainIcon} alt="Brain Icon" />
      </div>
    </div>
  );
};

export default TopbarAtom;
