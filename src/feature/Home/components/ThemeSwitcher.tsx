import { useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import useTheme from "../../../hooks/useTheme";
import { useTranslation } from "react-i18next";

interface ThemeSwitcherProps {
  /** Show icon + "Theme" label in one line (e.g. in mobile menu) */
  variant?: "default" | "menu" | "footer";
}

const ThemeSwitcher = ({ variant = "default" }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    if (theme !== selectedTheme) {
      toggleTheme();
    }
    setIsOpen(false);
  };

  const isMenu = variant === "menu";
  const isFooter = variant === "footer";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          isMenu
            ? "flex items-center gap-2 rounded-lg transition-colors text-neutral-50 hover:text-primary-400"
            : isFooter
              ? "p-2 rounded-full border border-[#737373] text-[#737373] hover:text-[#cccccc] hover:border-[#cccccc] transition-colors"
              : "p-2 rounded-lg hover:bg-neutral-700 transition-colors text-foreground"
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {theme === "light" ? <LuSun size={20} /> : <LuMoon size={20} />}
        {isMenu && <span className="text-sm font-medium">Theme</span>}
      </button>

      {isOpen && (
        <div
          className={`absolute bg-background border border-neutral-500 rounded-lg shadow-lg overflow-hidden p-2 z-50 min-w-[120px] ${
            isFooter
              ? "bottom-full mb-2 right-0 left-auto"
              : "top-full mt-1.5 left-0"
          }`}
        >
          <button
            onClick={() => handleThemeChange("light")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-neutral-700 transition-colors text-foreground text-sm"
          >
            <LuSun size={14} />
            <span>{t('Light')}</span>
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-neutral-700 transition-colors text-foreground text-sm"
          >
            <LuMoon size={14} />
            <span>{t('Dark')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;