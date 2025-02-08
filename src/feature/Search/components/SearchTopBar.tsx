import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { LuSearch } from 'react-icons/lu';
import SearchContainer from './SearchContainer';

const SearchTopBar: React.FC = () => {
  const {t} = useTranslation()
    const [searchTerm, setSearchTerm] = useState<string>('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setSearchTerm(event.target.value)

    }

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={t("Search")}
        className="w-full px-4 py-3 border-none bg-neutral-600 rounded-full outline-none"
      />
      <div className="absolute top-3 right-5 cursor-pointer ">
        <LuSearch className="h-6 w-6" />
      </div>

      {searchTerm && (
        <div className="absolute top-14 left-0 w-full bg-neutral-600 rounded-lg shadow-lg z-4000">
          <SearchContainer />
        </div>
      )}
    </div>
  );
}

export default SearchTopBar