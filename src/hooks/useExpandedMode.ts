import { useState, useCallback } from 'react';

interface UseExpandedModeReturn {
  isExpandedMode: boolean;
  handleExpandedMode: () => void;
}

export const useExpandedMode = (initialState = false): UseExpandedModeReturn => {
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(initialState);

  const handleExpandedMode = useCallback(() => {
    setIsExpandedMode((prev) => !prev);
  }, []);

  return {
    isExpandedMode,
    handleExpandedMode,
  };
};

export default useExpandedMode; 