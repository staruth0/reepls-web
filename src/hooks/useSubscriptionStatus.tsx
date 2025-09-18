import { useMemo } from 'react';
import { useGetPublicationSubscribers } from '../feature/Stream/Hooks';
import { useUser } from './useUser';
import { Subscriber } from '../models/datamodels';

export const useSubscriptionStatus = (publicationId: string) => {
  // Don't make the API call if publicationId is empty or undefined
  const { data: subscribersData, isLoading, error } = useGetPublicationSubscribers(
    publicationId && publicationId.trim() !== '' ? publicationId : ''
  );
  const { authUser } = useUser();

  const subscriptionStatus = useMemo(() => {
    // Early return if no publicationId or no authUser
    if (!publicationId || publicationId.trim() === '' || !authUser?.username) {
      return {
        isSubscribed: false,
        subscribers: [],
        subscribersCount: 0,
        isLoading: false,
        error: null
      };
    }

    // Handle loading state
    if (isLoading) {
      return {
        isSubscribed: false,
        subscribers: [],
        subscribersCount: 0,
        isLoading: true,
        error: null
      };
    }

    // Handle error state
    if (error) {
      return {
        isSubscribed: false,
        subscribers: [],
        subscribersCount: 0,
        isLoading: false,
        error
      };
    }

    // Handle case where data is not available or subscribers array is empty
    if (!subscribersData?.subscribers || !Array.isArray(subscribersData.subscribers)) {
      return {
        isSubscribed: false,
        subscribers: [],
        subscribersCount: 0,
        isLoading: false,
        error: null
      };
    }

    const subscribers: Subscriber[] = subscribersData.subscribers;
    const usernames = subscribers.map((subscriber: Subscriber) => subscriber.username);
    const isSubscribed = usernames.includes(authUser.username);

    return {
      isSubscribed,
      subscribers,
      subscribersCount: subscribers.length,
      isLoading: false,
      error: null
    };
  }, [subscribersData, authUser?.username, isLoading, error, publicationId]);

  return subscriptionStatus;
};

export default useSubscriptionStatus;
