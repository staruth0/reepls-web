# Stream Subscription Utilities

This directory contains utility functions and hooks for managing publication subscriptions in the Stream feature.

## Files

- `subscriptionUtils.ts` - Core utility functions for subscription management
- `../hooks/useSubscriptionStatus.tsx` - React hooks for subscription status checking

## Usage Examples

### 1. Basic Subscription Check

```tsx
import { useSubscriptionStatus } from '../hooks';

const MyComponent = () => {
  const { isSubscribed, isLoading, isError } = useSubscriptionStatus('publication-id-here');
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading subscription</div>;
  
  return (
    <div>
      {isSubscribed ? 'You are subscribed!' : 'You are not subscribed'}
    </div>
  );
};
```

### 2. Get Subscription Details

```tsx
import { useSubscriptionStatus } from '../hooks';

const SubscriptionDetails = () => {
  const { subscriptionDetails, isSubscribed } = useSubscriptionStatus('publication-id-here');
  
  if (!isSubscribed) return <div>Not subscribed</div>;
  
  return (
    <div>
      <h3>{subscriptionDetails?.title}</h3>
      <p>Subscribed on: {new Date(subscriptionDetails?.subscription_date).toLocaleDateString()}</p>
      <p>Status: {subscriptionDetails?.subscription_status}</p>
    </div>
  );
};
```

### 3. Check Multiple Publications

```tsx
import { useMultipleSubscriptionStatus } from '../hooks';

const MultipleSubscriptions = () => {
  const publicationIds = ['pub1', 'pub2', 'pub3'];
  const { subscriptionStatuses } = useMultipleSubscriptionStatus(publicationIds);
  
  return (
    <div>
      {publicationIds.map(id => (
        <div key={id}>
          Publication {id}: {subscriptionStatuses[id] ? 'Subscribed' : 'Not subscribed'}
        </div>
      ))}
    </div>
  );
};
```

### 4. Get All Active Subscriptions

```tsx
import { useActiveSubscriptions } from '../hooks';

const ActiveSubscriptions = () => {
  const { activeSubscriptionIds, isLoading } = useActiveSubscriptions();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h3>Active Subscriptions ({activeSubscriptionIds.length})</h3>
      {activeSubscriptionIds.map(id => (
        <div key={id}>Publication ID: {id}</div>
      ))}
    </div>
  );
};
```

### 5. Using Utility Functions Directly

```tsx
import { isUserSubscribedToPublication } from '../utils/subscriptionUtils';
import { useGetUserSubscriptions } from '../hooks';

const MyComponent = () => {
  const { data: subscriptions } = useGetUserSubscriptions();
  
  const checkSubscription = (publicationId: string) => {
    return isUserSubscribedToPublication(subscriptions?.data, publicationId);
  };
  
  return (
    <div>
      {checkSubscription('some-publication-id') ? 'Subscribed' : 'Not subscribed'}
    </div>
  );
};
```

## API Response Structure

The subscription API returns data in this format:

```typescript
interface SubscriptionResponse {
  message: string;
  publications: SubscriptionPublication[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

interface SubscriptionPublication {
  _id: string;
  title: string;
  short_description: string;
  description: string;
  cover_image: string;
  owner_id: string;
  articles_count: number;
  subscribers_count: number;
  is_deleted: boolean;
  is_public: boolean;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
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
```

## Hooks Available

1. **`useSubscriptionStatus(publicationId)`** - Check if user is subscribed to a specific publication
2. **`useActiveSubscriptions()`** - Get all active subscription IDs
3. **`useMultipleSubscriptionStatus(publicationIds)`** - Check multiple publications at once

## Utility Functions Available

1. **`isUserSubscribedToPublication(subscriptions, publicationId)`** - Check subscription status
2. **`getSubscriptionDetails(subscriptions, publicationId)`** - Get detailed subscription info
3. **`getActiveSubscriptionIds(subscriptions)`** - Get all active subscription IDs
