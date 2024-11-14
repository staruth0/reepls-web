import { useState, ReactNode,useEffect } from "react";
import { ThemeContext} from "./themeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const initialTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState<string>(initialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

   useEffect(() => {
     localStorage.setItem("theme", theme);
   }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
