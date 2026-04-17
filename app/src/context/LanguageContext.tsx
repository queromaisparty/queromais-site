import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language, TranslatableContent } from '@/types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (content: TranslatableContent | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'quero-mais-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      return stored || 'pt';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  const t = useCallback((content: TranslatableContent | string): string => {
    if (typeof content === 'string') {
      return content;
    }
    return content[currentLanguage] || content.pt || '';
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook conveniente para traduções
export function useTranslation() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  return { t, currentLanguage, setLanguage };
}
