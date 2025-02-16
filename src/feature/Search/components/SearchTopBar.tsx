import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuSearch, LuX } from "react-icons/lu";
import SearchContainer from "./SearchContainer";
import { useNavigate } from "react-router-dom";

const SearchTopBar: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      navigate(`/search/results/${trimmedSearchTerm.replace(/ /g, "+")}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
        placeholder={t("Search")}
        className="w-full px-4 py-3 border-none bg-neutral-600 rounded-full outline-none"
      />
      <div className="absolute top-3 right-5 cursor-pointer flex items-center gap-1">
        {searchTerm && <LuX className="size-5" onClick={handleClearSearch} />}
        <LuSearch className="size-6" onClick={handleSearch} />
      </div>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-neutral-600 rounded-lg shadow-lg z-4000">
          <SearchContainer />
        </div>
      )}
    </div>
  );
};

export default SearchTopBar;
