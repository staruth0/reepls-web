import React, {  useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 

import Tabs from "../../../components/molecules/Tabs/Tabs";

type FeedTab = "for-you" | "following" | "podcasts";

const ToggleFeed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the initial active tab based on the current URL
  const getInitialActiveTab = (): FeedTab => {
    if (location.pathname === "/feed/following") {
      return "following";
    } else if (location.pathname === "/feed/podcasts") {
      return "podcasts";
    }
    return "for-you"; // Default to "For you"
  };

  const [activeFeedTab, setActiveFeedTab] = useState<FeedTab>(getInitialActiveTab());

  // Update activeFeedTab when the URL changes
  useEffect(() => {
    setActiveFeedTab(getInitialActiveTab());
  }, [location.pathname]);

  const tabs = [
    { id: "for-you", title: "For you" },
    { id: "following", title: "Following" },
    { id: "podcasts", title: "Podcasts" }, 
  ];


  const handleTabClick = (tabId: number | string) => {

    const newTabId = tabId as FeedTab;

    setActiveFeedTab(newTabId); 

    switch (newTabId) {
      case "for-you":
        navigate("/feed");
        break;
      case "following":
        navigate("/feed/following");
        break;
      case "podcasts":
        navigate("/feed/podcasts");
        break;
      default:
        navigate("/feed"); 
    }
  };

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeFeedTab} 
      setActiveTab={handleTabClick}
      scale={true}
      borderBottom={false}
    />
  );
};

export default ToggleFeed;