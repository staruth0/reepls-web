import { useEffect, useState } from "react";


export const useResponsiveLayout = () => { 
  const [screenWidth,setScreenWidth] = useState(window.innerWidth); 

    const handleResize = () => { 
        setScreenWidth(window.innerWidth); 
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    const isTablet = screenWidth >= 640 && screenWidth < 1024;
    const isTabletSmall = screenWidth >= 640 && screenWidth < 900;
    const isMobile = screenWidth < 640;
    

    return {screenWidth,isTablet,isMobile,isTabletSmall}

}