// SuggestionContainer.tsx
import React from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuggestionContainerProps {
  text: string;
}

const SuggestionContainer: React.FC<SuggestionContainerProps> = ({ text }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedSearchTerm = text.trim();
    if (trimmedSearchTerm) {
      const query = encodeURIComponent(trimmedSearchTerm);
      navigate(`/search/results?query=${query}`);
    }
  };

  return (
    <div
      className="flex items-center gap-3 cursor-pointer p-2 hover:bg-neutral-700 rounded-lg transition-all duration-200"
      onClick={handleSearch}
    >
      <ArrowUpRight className="w-4 h-4 text-neutral-50 flex-shrink-0" />
      <p className="flex-1 text-neutral-50 truncate">{text}</p>
      <Search className="w-4 h-4 text-neutral-50 flex-shrink-0" />
    </div>
  );
};

export default SuggestionContainer;