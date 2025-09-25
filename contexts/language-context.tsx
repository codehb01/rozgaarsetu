"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translationService, ContentType } from '@/lib/translation-service';

// Import JSON translation files
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import mrTranslations from '../locales/mr.json';

export type Language = 'en' | 'hi' | 'mr';

// Type definition for translation structure
export type TranslationKeys = typeof enTranslations;

// Define the translations object
const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isFirstVisit: boolean;
  markVisited: () => void;
  translateText: (text: string, targetLang?: Language, contentType?: ContentType, contentId?: string) => Promise<string>;
  translateBatch: (items: Array<{text: string; contentType?: ContentType; contentId?: string}>) => Promise<string[]>;
  detectLanguage: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

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

  // Hybrid Translation Functions
  const translateText = async (
    text: string, 
    targetLang: Language = language, 
    contentType?: ContentType,
    contentId?: string
  ): Promise<string> => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          sourceLanguage: 'en',
          contentType: contentType || 'other',
          contentId: contentId,
          useCache: true, // Enable database caching
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.translatedText) {
        return data.translatedText;
      } else {
        throw new Error('Invalid translation response');
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  const translateBatch = async (
    items: Array<{text: string; contentType?: ContentType; contentId?: string}>
  ): Promise<string[]> => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            text: item.text,
            targetLanguage: language,
            sourceLanguage: 'en',
            contentType: item.contentType || 'other',
            contentId: item.contentId,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.translations) {
        return data.translations;
      } else {
        throw new Error('Invalid batch translation response');
      }
    } catch (error) {
      console.error('Batch translation error:', error);
      return items.map(item => item.text); // Return original texts if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  const detectLanguage = async (text: string): Promise<string> => {
    try {
      const response = await fetch('/api/detect-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.detectedLanguage) {
        return data.detectedLanguage;
      } else {
        throw new Error('Invalid language detection response');
      }
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English if detection fails
    }
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in any language
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      isFirstVisit, 
      markVisited, 
      translateText, 
      translateBatch,
      detectLanguage, 
      isTranslating 
    }}>
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