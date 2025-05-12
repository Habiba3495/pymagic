import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslation from "./locales/en/translation.json";
import arTranslation from "./locales/ar/translation.json";

// Define resources
const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector) // Detects the user's language
  .use(initReactI18next) // Passes i18n to react-i18next
  .init({
    supportedLngs: ['en', 'ar'], // Only base language codes
    resources,
    fallbackLng: "en", // Default language if the user's language is not available
    load: 'languageOnly', // Ignore region (e.g., 'en-US' becomes 'en')
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  })
  .then(() => {
    console.log("i18n initialized successfully:", i18n);
    console.log("i18n.changeLanguage exists:", typeof i18n.changeLanguage === "function");
    i18n.changeLanguage('en'); // غيّر اللغة بعد ما التهيئة تخلّص
  })
  .catch((error) => {
    console.error("Error initializing i18n:", error);
  });

export default i18n;