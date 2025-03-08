import React, { useEffect } from 'react';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { User } from '../../../models/datamodels';
import { useGetRecommendedUsersById } from '../../Profile/hooks';
import AuthorSugestionComponent from './AuthorSugestionComponent';
import SeeMore from './SeeMore';
const AuthorSuggestions: React.FC = () => {
  const { authUser } = useUser();
  const { data: recommendedUsers, isLoading, error } = useGetRecommendedUsersById(authUser?.id || '');

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1">
        <LuLoader className="animate-spin text-primary-400 text-xl m-4" />
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
    <div className="w-full flex flex-col gap-6 mt-4 py-1">
      {recommendedUsers?.slice(0, 4)?.map((user: User, index: number) => (
        <AuthorSugestionComponent
          key={`${user.id}-${index}`}
          username={user.username!}
          title={user.title || 'Suggested Author'}
          id={user._id || ''}
        />
      ))}
      <SeeMore />
    </div>
  );
};

export default AuthorSuggestions;
