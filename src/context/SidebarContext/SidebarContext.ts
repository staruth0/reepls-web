import { createContext } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const initialState: SidebarContextType = {
    isOpen: false,
    toggleSidebar: () => {},
}

const SidebarContext = createContext(initialState);
export { SidebarContext };