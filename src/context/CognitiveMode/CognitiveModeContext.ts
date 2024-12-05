import { createContext } from "react";

export interface CognitiveModeContextType {
  isCognitiveMode: boolean;
  toggleCognitiveMode: () => void;
}

export const CognitiveModeContext = createContext<CognitiveModeContextType>({
  isCognitiveMode: false,
  toggleCognitiveMode: () => {},
});
