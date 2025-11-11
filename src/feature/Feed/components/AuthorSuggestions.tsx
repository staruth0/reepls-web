import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthSuggestionSkeleton from '../../../components/atoms/AuthorSuggestionSkeleton';
import { useUser } from '../../../hooks/useUser';
import { User } from '../../../models/datamodels';
import { useGetRecommendedUsersById } from '../../Profile/hooks';
import AuthorSugestionComponent from './AuthorSugestionComponent';

import { useTranslation } from 'react-i18next';


const AuthorSuggestions: React.FC = () => {
  const { authUser } = useUser();
  const { data: recommendedUsers, isLoading, error } = useGetRecommendedUsersById(authUser?.id || '');
  const {t} = useTranslation();

  // Function to get friendly error messages specific to author suggestions
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return 'Something went wrong while finding authors for you.';

    // Handle common error cases
    if (error.message.includes('Network Error')) {
      return 'Looks like we’re offline! Check your connection and try again.';
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return 'We couldn’t find any authors to recommend right now.';
      }
      if (status === 500) {
        return 'Our suggestion engine is having a moment. Please try again soon!';
      }
      if (status === 429) {
        return 'Too many requests! Give us a sec to catch up.';
      }
    }

    // Default fallback for unhandled errors
    return 'Oops! Something unexpected happened while fetching author suggestions.';
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
      <div className="w-full flex flex-col gap-1 mt-2 py-1">
        <AuthSuggestionSkeleton />
        <AuthSuggestionSkeleton />
        <AuthSuggestionSkeleton />
      </div>
    );
  }

  // Error state with friendly message
  if (error) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1 text-neutral-50 text-center">
        {getFriendlyErrorMessage(error)}
      </div>
    );
  }

  // Ensure recommendedUsers is an array
  const usersArray = Array.isArray(recommendedUsers) ? recommendedUsers : [];

  // Empty state
  if (!usersArray.length) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1 text-gray-500 text-center">
        {t("feed.noSuggestions")}
      </div>
    );
  }

  // Success state
  return (
    <div className="w-full flex flex-col gap-6 mt-4 py-1">
      {usersArray.slice(0, 5).map((user: User, index: number) => (
        <AuthorSugestionComponent
          key={`${user.id}-${index}`}
          name={user.name!}
          username={user.username!}
          title={user.bio || ``}
          id={user._id || ''}
          isverified={user.is_verified_writer!}
        />
      ))}
    </div>
  );
};

export default AuthorSuggestions;
