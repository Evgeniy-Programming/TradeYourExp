import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru.json';
import en from './locales/en.json';
import zh from './locales/zh.json';

const STORAGE_KEY = 'language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'ru';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ru' || saved === 'en' || saved === 'zh') return saved;

  return 'ru';
};

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
