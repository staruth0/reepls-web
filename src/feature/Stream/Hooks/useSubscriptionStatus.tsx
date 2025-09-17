import { useMemo } from "react";
import { useGetUserSubscriptions } from "./index";
import { 
  isUserSubscribedToPublication, 
  getSubscriptionDetails, 
  getActiveSubscriptionIds,
  SubscriptionResponse 
} from "../utils/subscriptionUtils";

/**
 * Custom hook to check if user is subscribed to a specific publication
 * @param publicationId - The ID of the publication to check
 * @returns object with subscription status and loading state
 */
export const useSubscriptionStatus = (publicationId: string) => {
  const { 
    data: subscriptions, 
    isLoading, 
    isError, 
    error 
  } = useGetUserSubscriptions();

  const isSubscribed = useMemo(() => {
    return isUserSubscribedToPublication(subscriptions?.data, publicationId);
  }, [subscriptions?.data, publicationId]);

  const subscriptionDetails = useMemo(() => {
    return getSubscriptionDetails(subscriptions?.data, publicationId);
  }, [subscriptions?.data, publicationId]);

  return {
    isSubscribed,
    subscriptionDetails,
    isLoading,
    isError,
    error,
    subscriptions: subscriptions?.data
  };
};

/**
 * Custom hook to get all active subscription IDs
 * @returns object with active subscription IDs and loading state
 */
export const useActiveSubscriptions = () => {
  const { 
    data: subscriptions, 
    isLoading, 
    isError, 
    error 
  } = useGetUserSubscriptions();

  const activeSubscriptionIds = useMemo(() => {
    return getActiveSubscriptionIds(subscriptions?.data);
  }, [subscriptions?.data]);

  return {
    activeSubscriptionIds,
    isLoading,
    isError,
    error,
    subscriptions: subscriptions?.data
  };
};

/**
 * Custom hook to check multiple publications at once
 * @param publicationIds - Array of publication IDs to check
 * @returns object with subscription status for each publication
 */
export const useMultipleSubscriptionStatus = (publicationIds: string[]) => {
  const { 
    data: subscriptions, 
    isLoading, 
    isError, 
    error 
  } = useGetUserSubscriptions();

  const subscriptionStatuses = useMemo(() => {
    const statuses: Record<string, boolean> = {};
    
    publicationIds.forEach(id => {
      statuses[id] = isUserSubscribedToPublication(subscriptions?.data, id);
    });
    
    return statuses;
  }, [subscriptions?.data, publicationIds]);

  return {
    subscriptionStatuses,
    isLoading,
    isError,
    error,
    subscriptions: subscriptions?.data
  };
};
