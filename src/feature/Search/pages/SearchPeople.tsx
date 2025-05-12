import React, { useEffect } from 'react';
import AuthorComponent from '../../Saved/Components/AuthorComponent';
// import { useUser } from '../../../hooks/useUser';
import { useGetPeopleResults } from '../hooks';
import { toast } from 'react-toastify'; // Added for toast notifications
import { useTranslation } from 'react-i18next';

interface SearchResult {
  _id: string;
  username: string;
  type: string;
  score: number;
  isFollowing: boolean;
}

interface SearchPeopleProps {
  query: string;
}

const SearchPeople: React.FC<SearchPeopleProps> = ({ query }) => {
  // const { authUser } = useUser();
  const { data: searchResults, isLoading, error } = useGetPeopleResults(query);
  const {t} = useTranslation()

  // Function to get friendly error messages specific to people search results
  const getFriendlyErrorMessage = (error: any, query?: string): string => {
    if (!error) return t("search.errors.default");
  
    if (error.message.includes("Network Error")) {
      return t("search.errors.network");
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return t("search.errors.notFound", { query }); // Dynamic query
      }
      if (status === 500) {
        return t("search.errors.server");
      }
      if (status === 429) {
        return t("search.errors.rateLimit");
      }
    }
    return t("search.errors.default");
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
      <div className="people w-full min-w-[350px] max-w-[360px] flex flex-col items-center flex-shrink-0">
        <div className="space-y-4 mt-4">
          <p className="text-neutral-500 text-center">{`${t("loadingResults")}...`}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="people w-full min-w-[350px] max-w-[360px] flex flex-col items-center flex-shrink-0">
        <div className="space-y-4 mt-4">
          <p className="text-neutral-50 text-center py-4">
            {getFriendlyErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  // Success or empty state
  return (
    <div className="people w-full min-w-[350px] max-w-[360px] flex flex-col items-center flex-shrink-0">
      <div className="space-y-4 mt-4">
        {searchResults?.length > 0 ? (
          searchResults.map((person: SearchResult) => (
            <AuthorComponent
              key={person._id}
              username={person.username}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-center py-4">
            No people found for "{query}". Try something else!
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPeople;