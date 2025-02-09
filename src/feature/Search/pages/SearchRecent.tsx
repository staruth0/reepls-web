import React from "react";
import SuggestionContainer from "../components/SuggestionContainer";

const articles = [
  "Anglophone crisis",
  "Angel investments 2024",
  "Anglophone journalists",
];

const SearchRecent: React.FC = () => {
  return (
    <div className="recent space-y-3">
      {articles.map((article,index) => (
        <SuggestionContainer key={index} text={ article} />
      ))}
    </div>
  );
};

export default SearchRecent;
