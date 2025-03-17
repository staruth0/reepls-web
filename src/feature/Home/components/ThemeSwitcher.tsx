import { useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import useTheme from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    if (theme !== selectedTheme) {
      toggleTheme();
    }
    setIsOpen(false);
  };



  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
      >
        {theme === "light" ? <LuSun size={20} /> : <LuMoon size={20} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-10 right-0  dark:bg-background border border-neutral-500  rounded-lg shadow-lg overflow-hidden p-2">
          <button
            onClick={() => handleThemeChange("light")}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-neutral-700  transition-colors"
          >
            <LuSun size={16} />
            <span>{t('Light')}</span>
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-neutral-700  transition-colors"
          >
            <LuMoon size={16} />
            <span>{t('Dark')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;