import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translationAR from '../locales/ar/translation.json';
import translationEN from '../locales/en/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', 
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ar: {
        translation: translationAR
      },
      en: {
        translation: translationEN
      }
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'navigator'],
      caches: ['localStorage'],
    },
  });

localStorage.setItem('i18nextLng', 'en');

export default i18n;
