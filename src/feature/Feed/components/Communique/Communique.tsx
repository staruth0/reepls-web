import React, { useEffect } from "react";
import TopRightComponent from "../../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../../components/molecules/RightRecentComponent";
import { useGetCommuniquerArticles } from "../../../Blog/hooks/useArticleHook";
import Trending from "../Trending";
import CommuniqueSkeleton from "../CommuniqueSkeleton";
import { toast } from "react-toastify"; // Added for toast notifications

const Communique: React.FC = () => {
  const { data, isLoading, error } = useGetCommuniquerArticles();

  // Function to get friendly error messages specific to communique articles
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong while fetching recent updates.";

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return "Oops! You might be offline. Check your connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return "No recent updates found right now. Check back later!";
      }
      if (status === 500) {
        return "Our servers are catching their breath. Please try again soon!";
      }
      if (status === 429) {
        return "Too many requests! Give us a moment to catch up.";
      }
    }

    // Default fallback for unhandled errors
    return "Something unexpected happened while loading updates. We’re on it!";
  };

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  

  // Loading state
  if (isLoading) {
    return (
      <>
        <TopRightComponent />
        <div className="flex flex-col gap-4 mt-5">
          <CommuniqueSkeleton />
          <CommuniqueSkeleton />
        </div>
        <Trending />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <TopRightComponent />
        <div className="flex flex-col gap-4 mt-5 text-neutral-50 text-center">
          {getFriendlyErrorMessage(error)}
        </div>
       
      </>
    );
  }

  // Success state
  return (
    <>
      <TopRightComponent />
      <RightRecentComponent communiqueList={data?.pages[0].articles} />
      <Trending />
    </>
  );
};

export default Communique;