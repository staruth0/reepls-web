import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSearch, LuX } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';
import { useGetArticleTitles, useGetPostKeywords, useGetSearchSuggestions, useGetUserNames } from '../hooks';
import SearchContainer from './SearchContainer';
import { SearchContainerContext } from '../../../context/suggestionContainer/isSearchcontainer';

const SearchTopBar: React.FC<{ initialSearchTerm?: string }> = ({ initialSearchTerm }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const { isSearchContainerOpen, setSearchContainerOpen } = useContext(SearchContainerContext);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || query || '');
  const navigate = useNavigate();
  const { authUser } = useUser();
  const { data: titlesData } = useGetArticleTitles();
  const { data: keywordsData } = useGetPostKeywords();
  const { data: userNames } = useGetUserNames();
  const { data } = useGetSearchSuggestions(authUser?.id || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSearchContainerOpen(!!value.trim()); // Open container when there's input
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchContainerOpen(false);
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      const query = encodeURIComponent(trimmedSearchTerm);
      navigate(`/search/results?query=${query}`);
      setSearchContainerOpen(false); // Close container immediately after search
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const regex = new RegExp(searchTerm.trim(), 'i');

    // Combine search history, titles, and keywords
    const allSuggestions = [
      ...(data?.searchHistory || []),
      ...(titlesData?.titles || []),
      ...(keywordsData?.keywords || []),
      ...(userNames?.name || [])
    ];

    return allSuggestions.filter((item: string) => regex.test(item));
  }, [data?.searchHistory, titlesData?.titles, keywordsData?.keywords, searchTerm, userNames?.name]);

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={t('search.searchPlaceholder')}
        className="w-full px-4 py-3 border-none bg-neutral-600 rounded-full outline-none text-neutral-100 placeholder-neutral-400"
      />
      <div className="absolute top-3 right-5 cursor-pointer flex items-center gap-2 text-neutral-400">
        {searchTerm && (
          <LuX 
            className="size-5 hover:text-neutral-200 transition-colors" 
            onClick={handleClearSearch} 
          />
        )}
        <LuSearch 
          className="size-6 hover:text-neutral-200 transition-colors" 
          onClick={handleSearch} 
        />
      </div>

      {isSearchContainerOpen && (
        <div className="absolute top-14 left-0 w-full bg-neutral-600 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
          <SearchContainer searches={filteredSuggestions} />
        </div>
      )}
    </div>
  );
};

export default SearchTopBar;