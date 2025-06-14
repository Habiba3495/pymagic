import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import arTranslation from "./locales/ar/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(LanguageDetector) // Detects the user's language
  .use(initReactI18next) 
  .init({
    supportedLngs: ['en', 'ar'], 
    resources,
    fallbackLng: "en",
    load: 'languageOnly', 
    interpolation: {
      escapeValue: false, 
    },
  })
  .then(() => {
    console.log("i18n initialized successfully:", i18n);
    console.log("i18n.changeLanguage exists:", typeof i18n.changeLanguage === "function");
    i18n.changeLanguage('en'); 
  })
  .catch((error) => {
    console.error("Error initializing i18n:", error);
  });

export default i18n;