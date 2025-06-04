import { inject, provide, ref } from 'vue';
import { translations } from '../utils/translations';

const TRANSLATION_KEY = Symbol('translation');

export function createTranslationProvider() {
  const storedLang = localStorage.getItem('language') || 'en';
  const currentLanguage = ref(storedLang);
  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang;
      localStorage.setItem('language', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };
  
  const t = (key) => {
    const lang = currentLanguage.value;
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations.en[key] || key;
  };
  
  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'en' ? 'km' : 'en';
    setLanguage(newLang);
  };

  const translationProvider = {
    currentLanguage,
    setLanguage,
    t,
    toggleLanguage
  };
  provide(TRANSLATION_KEY, translationProvider);
  return translationProvider;
}

export function useTranslation() {
  const translation = inject(TRANSLATION_KEY);
  if (!translation) {
    throw new Error('Translation provider not found! Ensure it is set up in your root component.');
  }
  return translation;
}