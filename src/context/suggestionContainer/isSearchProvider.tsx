import React, { useState, ReactNode } from "react";
import { SearchContainerContext } from "./isSearchcontainer"; 

interface SearchContainerProviderProps {
  children: ReactNode;
}

const SearchContainerProvider: React.FC<SearchContainerProviderProps> = ({
  children,
}) => {
  const [isSearchContainerOpen, setIsSearchContainerOpen] = useState<boolean>(false);

  const handleSetSearchContainerOpen = (isOpen: boolean) => {
    setIsSearchContainerOpen(isOpen);
  };

  return (
    <SearchContainerContext.Provider
      value={{ isSearchContainerOpen, setSearchContainerOpen: handleSetSearchContainerOpen }}
    >
      {children}
    </SearchContainerContext.Provider>
  );
};

export default SearchContainerProvider;