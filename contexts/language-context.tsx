"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isFirstVisit: boolean;
  markVisited: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration check to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    
    // Check if user has visited before
    const hasVisited = localStorage.getItem('rozgaar-visited');
    const savedLanguage = localStorage.getItem('rozgaar-language') as Language;
    
    if (hasVisited && savedLanguage) {
      setLanguageState(savedLanguage);
      setIsFirstVisit(false);
    } else {
      // First visit - try to detect system language
      const systemLang = navigator.language.toLowerCase();
      if (systemLang.includes('hi')) {
        setLanguageState('hi');
      } else if (systemLang.includes('mr')) {
        setLanguageState('mr');
      } else {
        setLanguageState('en');
      }
      setIsFirstVisit(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rozgaar-language', lang);
  };

  const markVisited = () => {
    setIsFirstVisit(false);
    localStorage.setItem('rozgaar-visited', 'true');
  };

  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isFirstVisit, markVisited }}>
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