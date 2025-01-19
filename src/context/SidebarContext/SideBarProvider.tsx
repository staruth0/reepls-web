import React, { useState } from 'react'
import { SidebarContext } from './SidebarContext'

interface SideBarProviderProps { 
    children: React.ReactNode
}

const SideBarProvider: React.FC<SideBarProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => { 
        setIsOpen((prev) => !prev);
    }

  return (
      <SidebarContext.Provider value={{isOpen,toggleSidebar}}>{children}</SidebarContext.Provider>
  )
}

export default SideBarProvider