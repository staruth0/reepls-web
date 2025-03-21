import React, { useEffect } from 'react';
import AuthorComponent from '../../Saved/Components/AuthorComponent';
import { useUser } from '../../../hooks/useUser';
import { useGetPeopleResults } from '../hooks';

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

  useEffect(() => {
    console.log('user id', authUser?.id);
    console.log('search results', searchResults);
  }, [authUser, searchResults]);

  return (
    <div className="people">
      {/* Section for Search Results */}
      <div className="space-y-4 mt-4">
        {isLoading ? (
          <p className="text-neutral-500 text-center">Loading search results...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error.message}</p>
        ) : searchResults?.length > 0 ? (
          searchResults.map((person: SearchResult) => (
            <AuthorComponent
              key={person._id}
              username={person.username}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-center">No people found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPeople;