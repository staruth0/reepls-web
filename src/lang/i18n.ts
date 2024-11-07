import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enlang from './locales/en.json'
import frlang from './locales/fr.json'

const resources = {
  en: {
    translation: enlang,
  },
  fr: {
    translation: frlang,
  },
};

i18n
  .use(initReactI18next)
  .init({
      resources,
      fallbackLng:'en',
      lng: "en",
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
