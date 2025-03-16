import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSearch, LuX } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';
import { useGetSearchSuggestions } from '../hooks';
import SearchContainer from './SearchContainer';

const SearchTopBar: React.FC<{ initialSearchTerm?: string }> = ({ initialSearchTerm }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm ?? '');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { authUser } = useUser();
  const { data } = useGetSearchSuggestions(authUser?.id || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      const query = encodeURIComponent(trimmedSearchTerm);
      navigate(`/search/results?query=${query}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter searchHistory using regex based on searchTerm
  const filteredSearchHistory = useMemo(() => {
    if (!data?.searchHistory || !searchTerm) return data?.searchHistory || [];

    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    return data.searchHistory.filter((historyItem: string) => regex.test(historyItem));
  }, [data?.searchHistory, searchTerm]);

  useEffect(() => {
    if (data) {
      console.log('Search History:', data.searchHistory);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={t('Search')}
        className="w-full px-4 py-3 border-none bg-neutral-600 rounded-full outline-none"
      />
      <div className="absolute top-3 right-5 cursor-pointer flex items-center gap-1 text-neutral-400">
        {searchTerm && <LuX className="size-5" onClick={handleClearSearch} />}
        <LuSearch className="size-6" onClick={handleSearch} />
      </div>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-neutral-600 rounded-lg shadow-lg z-50">
          {filteredSearchHistory.length > 0 ? (
            <SearchContainer searches={filteredSearchHistory} />
          ) : (
            <div className="p-4 text-neutral-300 text-center">No matching search history</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTopBar;
