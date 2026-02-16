import React from 'react';

import { LuLoader } from 'react-icons/lu';
import { useUser } from '../../../hooks/useUser';
import { User } from '../../../models/datamodels';
import AuthorSuggestionComponent from '../../Feed/components/AuthorSugestionComponent';
import { useGetRecommendedUsersById } from '../../Profile/hooks';
import { useTranslation } from 'react-i18next';

const SimilarProfiles: React.FC = () => {
  const { authUser } = useUser();
  const { data: recommendedUsers, isLoading, error } = useGetRecommendedUsersById(authUser?.id || '');
  const {t} = useTranslation()

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1">
        <LuLoader className="animate-spin text-primary-400 text-4xl m-4" />
      </div>
    );
  }

  if (error) {
    return <div className="w-full flex flex-col gap-6 mt-4 py-1 text-red-500">{t("profile.errors.error")}: {error.message}</div>;
  }

  // Ensure recommendedUsers is an array
  const usersArray = Array.isArray(recommendedUsers) ? recommendedUsers : [];

  if (!usersArray.length) {
    return <div className="w-full flex flex-col gap-6 mt-4 py-1 text-gray-500">{t("profile.errors.noRecommendedUser")}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-4 py-1 px-4">
      {usersArray.slice(0, 4).map((user: User, index: number) => (
        <AuthorSuggestionComponent
          key={`${user.id || user._id || index}-${index}`}
          username={user.username || ''}
          title={user.bio || 'no bio'}
          id={user._id || user.id || ''}
          isverified={user.is_verified_writer || false}
          name={user.name || ''}
        />
      ))}
    </div>
  );
};

export default SimilarProfiles;
