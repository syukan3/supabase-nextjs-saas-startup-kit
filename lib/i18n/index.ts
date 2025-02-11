import type { Locale } from './types';

// Import dictionaries
import en from './dictionaries/en.json';
import ja from './dictionaries/ja.json';

const dictionaries = {
  en,
  ja,
};

export const getTranslations = (locale: Locale) => {
  return dictionaries[locale];
};

export const getSupportedLocales = () => {
  return Object.keys(dictionaries) as Locale[];
}; 