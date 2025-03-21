import React from 'react';

import { LuLoader } from 'react-icons/lu';
import { useUser } from '../../../hooks/useUser';
import { User } from '../../../models/datamodels';
import AuthorSuggestionComponent from '../../Feed/components/AuthorSugestionComponent';
import { useGetRecommendedUsersById } from '../../Profile/hooks';

const SimilarProfiles: React.FC = () => {
  const { authUser } = useUser();
  const { data: recommendedUsers, isLoading, error } = useGetRecommendedUsersById(authUser?.id || '');

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1">
        <LuLoader className="animate-spin text-primary-400 text-4xl m-4" />
      </div>
    );
  }

  if (error) {
    return <div className="w-full flex flex-col gap-6 mt-4 py-1 text-red-500">Error: {error.message}</div>;
  }

  if (!recommendedUsers?.length) {
    return <div className="w-full flex flex-col gap-6 mt-4 py-1 text-gray-500">No recommended authors found.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-4 py-1 px-4">
      {recommendedUsers?.slice(0, 4)?.map((user: User, index: number) => (
        <AuthorSuggestionComponent
          key={`${user.id}-${index}`}
          username={user.username!}
          title={user.bio || 'Suggested Author'}
          id={user._id || ''}
          isverified={user.is_verified_writer!}
        />
      ))}
    </div>
  );
};

export default SimilarProfiles;
