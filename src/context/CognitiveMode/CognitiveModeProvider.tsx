import React, { useState, ReactNode } from "react";
import { CognitiveModeContext } from "./CognitiveModeContext";

interface CognitiveModeProviderProps {
  children: ReactNode;
}

const CognitiveModeProvider: React.FC<CognitiveModeProviderProps> = ({
  children,
}) => {
  const [isCognitiveMode, setIsCognitiveMode] = useState<boolean>(false);

  const toggleCognitiveMode = () => {
    setIsCognitiveMode((prevMode) => !prevMode);
  };
  

  return (
    <CognitiveModeContext.Provider
      value={{ isCognitiveMode, toggleCognitiveMode }}
    >
      {children}
    </CognitiveModeContext.Provider>
  );
};

export default CognitiveModeProvider;
