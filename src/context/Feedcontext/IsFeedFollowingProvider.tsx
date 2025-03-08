import React, { useState, ReactNode } from "react";
import { FeedFollowingContext } from "./IsFeedFollowing";

interface FeedFollowingProviderProps {
  children: ReactNode;
}

const FeedFollowingProvider: React.FC<FeedFollowingProviderProps> = ({
  children,
}) => {
  const [isFeedFollowing, setIsFeedFollowing] = useState<boolean>(false);

  const toggleFeedFollowing = () => {
    setIsFeedFollowing((prevMode) => !prevMode);
  };

  return (
    <FeedFollowingContext.Provider
      value={{ isFeedFollowing, toggleFeedFollowing }}
    >
      {children}
    </FeedFollowingContext.Provider>
  );
};

export default FeedFollowingProvider;
