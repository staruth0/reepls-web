import { useContext } from "react";
import { ThemeContext } from "../context/Theme/themeContext";
import type { ThemeContextProps }  from '../context/Theme/themeContext'

const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }


  return context;
};

export default useTheme;
