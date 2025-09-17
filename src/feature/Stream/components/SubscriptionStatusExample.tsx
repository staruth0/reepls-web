import React from "react";
import { useSubscriptionStatus, useActiveSubscriptions } from "../hooks";

interface SubscriptionStatusExampleProps {
  publicationId: string;
}

/**
 * Example component demonstrating how to use the subscription status hooks
 */
export const SubscriptionStatusExample: React.FC<SubscriptionStatusExampleProps> = ({ 
  publicationId 
}) => {
  // Check if user is subscribed to a specific publication
  const { 
    isSubscribed, 
    subscriptionDetails, 
    isLoading, 
    isError 
  } = useSubscriptionStatus(publicationId);

  // Get all active subscriptions
  const { activeSubscriptionIds } = useActiveSubscriptions();

  if (isLoading) {
    return <div>Loading subscription status...</div>;
  }

  if (isError) {
    return <div>Error loading subscription status</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Publication ID:</strong> {publicationId}
        </div>
        
        <div>
          <strong>Is Subscribed:</strong>{" "}
          <span className={isSubscribed ? "text-green-600" : "text-red-600"}>
            {isSubscribed ? "Yes" : "No"}
          </span>
        </div>

        {subscriptionDetails && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Subscription Details:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Subscription Date:</strong> {new Date(subscriptionDetails.subscription_date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {subscriptionDetails.subscription_status}</div>
              <div><strong>User Role:</strong> {subscriptionDetails.user_role}</div>
              <div><strong>Publication Title:</strong> {subscriptionDetails.title}</div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <strong>Total Active Subscriptions:</strong> {activeSubscriptionIds.length}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatusExample;
