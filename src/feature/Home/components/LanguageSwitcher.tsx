import { useState } from "react";
import { LuGlobe } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const {t} = useTranslation()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg  transition-colors"
      >
        <LuGlobe className="text-plain-a" />
        <span className="text-sm font-medium text-plain-a">
          {i18n.language === "en" ? t('English') : t('French')}
        </span>
      </button>

      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-100 top-4 right-0 bg-background border border-neutral-500 p-2 rounded-lg shadow-lg w-40"
        >
          <div
            onClick={() => handleLanguageChange("en")}
            className="p-2 text-sm text-plain-a hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            {t('English')}
          </div>
          <div
            onClick={() => handleLanguageChange("fr")}
            className="p-2 text-sm text-plain-a hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            {t('French')}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;