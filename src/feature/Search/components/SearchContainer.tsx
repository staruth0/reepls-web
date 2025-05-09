import React from 'react';
import SuggestionContainer from './SuggestionContainer';

interface SearchContainerProps {
  searches: string[];
}

const SearchContainer: React.FC<SearchContainerProps> = ({ searches }) => {
  return (
    <div className="min-w-[37vw] bg-neutral-600 rounded-lg p-4 flex flex-col gap-2">
      {searches.map((search, index) => (
        <SuggestionContainer key={index} text={search} />
      ))}
    </div>
  );
};

export default SearchContainer;