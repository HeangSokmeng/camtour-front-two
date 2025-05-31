import { inject, provide, ref } from 'vue';
import { translations } from '../utils/translations';

const TRANSLATION_KEY = Symbol('translation');

export function createTranslationProvider() {
  // Get the stored language or default to 'en'
  const storedLang = localStorage.getItem('language') || 'en';
  const currentLanguage = ref(storedLang);
  
  // Save language preference to localStorage
  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang;
      localStorage.setItem('language', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };
  
  // Translate function
  const t = (key) => {
    const lang = currentLanguage.value;
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    // Fallback to English or key if translation is missing
    return translations.en[key] || key;
  };
  
  // Switch between languages
  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'en' ? 'km' : 'en';
    setLanguage(newLang);
  };
  
  // Create the provider object
  const translationProvider = {
    currentLanguage,
    setLanguage,
    t,
    toggleLanguage
  };
  
  // Provide the translation context to components
  provide(TRANSLATION_KEY, translationProvider);
  
  return translationProvider;
}

// Use the translation in any component
export function useTranslation() {
  const translation = inject(TRANSLATION_KEY);
  if (!translation) {
    throw new Error('Translation provider not found! Ensure it is set up in your root component.');
  }
  return translation;
}