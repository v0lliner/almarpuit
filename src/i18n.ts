import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationET from './locales/et/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  et: {
    translation: translationET,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'et', // default language
    fallbackLng: 'et',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;