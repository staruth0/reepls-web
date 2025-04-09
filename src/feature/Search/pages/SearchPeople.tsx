import React, { useEffect } from 'react';
import AuthorComponent from '../../Saved/Components/AuthorComponent';
import { useUser } from '../../../hooks/useUser';
import { useGetPeopleResults } from '../hooks';
import { toast } from 'react-toastify'; // Added for toast notifications

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
  const { authUser } = useUser();
  const { data: searchResults, isLoading, error } = useGetPeopleResults(query);

  // Function to get friendly error messages specific to people search results
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong while searching for people.";

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return "Oops! Looks like you’re offline. Check your connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return `No people found for "${query}". Try a different search!`;
      }
      if (status === 500) {
        return "Our search system is having a moment. Please try again soon!";
      }
      if (status === 429) {
        return "Too many searches! Give us a moment to catch up.";
      }
    }

    // Default fallback for unhandled errors
    return `Something unexpected happened while searching people for "${query}".`;
  };

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  // Debug log
  useEffect(() => {
    console.log('user id', authUser?.id);
    console.log('search results', searchResults);
  }, [authUser, searchResults]);

  // Loading state
  if (isLoading) {
    return (
      <div className="people w-full min-w-[350px] max-w-[360px] flex flex-col items-center flex-shrink-0">
        <div className="space-y-4 mt-4">
          <p className="text-neutral-500 text-center">Loading search results...</p>
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