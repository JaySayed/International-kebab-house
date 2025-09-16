import { useState, useEffect, createContext, useContext } from 'react';
import type { Language } from '@/lib/translations';
import { isRTL, getDirection } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguageState() {
  // Default to English, with localStorage persistence
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved && ['en', 'fa', 'ps'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      // Set document direction and lang attribute
      document.documentElement.dir = getDirection(lang);
      document.documentElement.lang = lang;
    }
  };

  // Set initial document direction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = getDirection(language);
      document.documentElement.lang = language;
    }
  }, [language]);

  return {
    language,
    setLanguage,
    isRTL: isRTL(language),
    direction: getDirection(language),
  };
}