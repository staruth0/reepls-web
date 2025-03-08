import { createContext } from "react";

export interface FeedFollowingContextType {
  isFeedFollowing: boolean;
  toggleFeedFollowing: () => void;
}

export const FeedFollowingContext = createContext<FeedFollowingContextType>({
  isFeedFollowing: true,
  toggleFeedFollowing: () => {},
});
