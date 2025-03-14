import React from "react";
import SuggestionContainer from "../components/SuggestionContainer";

interface SearchRecentProps { 
  history: string[];
}

const SearchRecent: React.FC<SearchRecentProps> = ({ history }) => {
  return (
    <div className="recent space-y-3">
      {history.map((article,index) => (
        <SuggestionContainer key={index} text={ article} />
      ))}
      {history.length === 0 && <p className="flex justify-center">No recent searches</p>}
    </div>
  );
};

export default SearchRecent;
