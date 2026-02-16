import { createContext } from "react";

export interface SearchContainerContextType {
  isSearchContainerOpen: boolean;
  setSearchContainerOpen: (isOpen: boolean) => void;
}

export const SearchContainerContext = createContext<SearchContainerContextType>({
  isSearchContainerOpen: false,
  setSearchContainerOpen: () => {},
});