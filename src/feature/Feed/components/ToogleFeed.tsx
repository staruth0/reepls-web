import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FeedFollowingContext } from "../../../context/Feedcontext/IsFeedFollowing";
import Tabs from "../../../components/molecules/Tabs/Tabs";


const tabs = [
  { id: 1, title: "For you" },
  { id: 2, title: "Following" },
];

const ToggleFeed: React.FC = () => {
  const { isFeedFollowing, toggleFeedFollowing } = useContext(FeedFollowingContext);
  const navigate = useNavigate();

  // Handle tab click
  const handleTabClick = (tabId: number | string) => {
    if (tabId === 1 && isFeedFollowing) {
      toggleFeedFollowing(); 
      navigate("/feed");
    } else if (tabId === 2 && !isFeedFollowing) {
      toggleFeedFollowing(); 
      navigate("/feed/following");
    }
  };

  return (
    <Tabs
      tabs={tabs}
      activeTab={isFeedFollowing ? 2 : 1} 
      setActiveTab={handleTabClick}
      scale={true}
      borderBottom={false}
    />
  );
};

export default ToggleFeed;
