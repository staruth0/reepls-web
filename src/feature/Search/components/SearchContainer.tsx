import React from 'react';
import SuggestionContainer from './SuggestionContainer'; // Adjust the path based on your file structure

interface SearchContainerProps { 
  searches: string[];
}

const SearchContainer: React.FC<SearchContainerProps> = ({ searches }) => {
  return (
    <div className='min-w-[37vw] bg-background rounded-lg p-4 flex flex-col gap-4'>
      {searches.map((search, index) => (
        <SuggestionContainer key={index} text={search} />
      ))}
    </div>
  );
};

export default SearchContainer;