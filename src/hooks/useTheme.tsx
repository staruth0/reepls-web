import { useContext } from "react";
import { ThemeContext } from "../context/Theme/themeContext";

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("error with context");
  }

  return context;
};

export default useTheme;
