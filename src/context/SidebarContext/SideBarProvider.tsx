import React, { useEffect, useState } from 'react'
import { SidebarContext } from './SidebarContext'

interface SideBarProviderProps { 
    children: React.ReactNode
}

const SideBarProvider: React.FC<SideBarProviderProps> = ({ children }) => {
     const [screenWidth,setScreenWidth] = useState(window.innerWidth); 
    
        const handleResize = () => { 
            setScreenWidth(window.innerWidth); 
        }
        useEffect(() => {
            window.addEventListener('resize', handleResize);
    
            return () => window.removeEventListener('resize', handleResize);
        }, [screenWidth]);

    const [isOpen, setIsOpen] = useState<boolean>(false);
 const isTabletSmall = screenWidth >= 640 && screenWidth < 930;
    const toggleSidebar = () => { 
        if(isTabletSmall){
            setIsOpen(false)
        }else{
            setIsOpen((prev) => !prev);
        }
       
    }

    useEffect(()=>{

        if(isTabletSmall) setIsOpen(false)
    },[isTabletSmall])
  return (
      <SidebarContext.Provider value={{isOpen,toggleSidebar}}>{children}</SidebarContext.Provider>
  )
}

export default SideBarProvider