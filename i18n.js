import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

// Import language files
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
const getDeviceLanguage = () => {
  const { languageTag } = Localization.getLocales()[0];
  return languageTag ? languageTag.split('-')[0] : 'en';
};

i18n
  .use(initReactI18next) 
  .init({
    fallbackLng: 'en', 
    lng: getDeviceLanguage(), 
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta } // 👈 Add Hindi language support
    },
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
