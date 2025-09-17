import { Publication } from "../../../models/datamodels";

// Type for the subscription response structure
export interface SubscriptionResponse {
  message: string;
  publications: SubscriptionPublication[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

// Type for a publication with subscription details
export interface SubscriptionPublication extends Publication {
  subscription_date: string;
  subscription_id: string;
  subscription_status: "active" | "inactive" | "cancelled";
  user_role: "subscriber" | "owner" | "collaborator";
  owner: {
    _id: string;
    username: string;
    role: string;
    is_verified_writer: boolean;
  };
}

/**
 * Checks if a user is subscribed to a specific publication
 * @param subscriptions - The subscription response data
 * @param publicationId - The ID of the publication to check
 * @returns boolean - true if subscribed, false otherwise
 */
export const isUserSubscribedToPublication = (
  subscriptions: SubscriptionResponse | undefined,
  publicationId: string
): boolean => {
  if (!subscriptions?.publications || !publicationId) {
    return false;
  }

  return subscriptions.publications.some(
    (publication) => 
      publication._id === publicationId && 
      publication.subscription_status === "active"
  );
};

/**
 * Gets the subscription details for a specific publication
 * @param subscriptions - The subscription response data
 * @param publicationId - The ID of the publication to check
 * @returns SubscriptionPublication | undefined - The subscription details or undefined if not found
 */
export const getSubscriptionDetails = (
  subscriptions: SubscriptionResponse | undefined,
  publicationId: string
): SubscriptionPublication | undefined => {
  if (!subscriptions?.publications || !publicationId) {
    return undefined;
  }

  return subscriptions.publications.find(
    (publication) => 
      publication._id === publicationId && 
      publication.subscription_status === "active"
  );
};

/**
 * Gets all active subscription IDs
 * @param subscriptions - The subscription response data
 * @returns string[] - Array of active subscription publication IDs
 */
export const getActiveSubscriptionIds = (
  subscriptions: SubscriptionResponse | undefined
): string[] => {
  if (!subscriptions?.publications) {
    return [];
  }

  return subscriptions.publications
    .filter(publication => publication.subscription_status === "active")
    .map(publication => publication._id || '');
};
