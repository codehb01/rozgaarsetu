'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string, context?: string) => Promise<string>;
  translateSync: (text: string, context?: string) => string;
  isLoading: boolean;
  translateBatch: (texts: string[], context?: string) => Promise<string[]>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationCache {
  [key: string]: string;
}

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [cache, setCache] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('app-language', language);
  }, []);

  // Generate cache key
  const getCacheKey = useCallback((text: string, targetLang: Language, context?: string) => {
    return `${text}|en|${targetLang}|${context || ''}`;
  }, []);

  // Batch translate multiple texts
  const translateBatch = useCallback(async (texts: string[], context?: string): Promise<string[]> => {
    if (currentLanguage === 'en') {
      return texts;
    }

    // Check which texts are already cached
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = new Array(texts.length);

    texts.forEach((text, index) => {
      const cacheKey = getCacheKey(text, currentLanguage, context);
      if (cache[cacheKey]) {
        results[index] = cache[cacheKey];
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    // If all texts are cached, return immediately
    if (uncachedTexts.length === 0) {
      return results;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/translate/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: uncachedTexts,
          targetLanguage: currentLanguage,
          sourceLanguage: 'en',
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Batch translation failed');
      }

      const result = await response.json();
      const translations = result.data.translations;

      // Update cache and results
      const newCacheEntries: TranslationCache = {};
      translations.forEach((translation: any, index: number) => {
        const originalText = uncachedTexts[index];
        const translatedText = translation.translatedText;
        const resultIndex = uncachedIndices[index];
        
        results[resultIndex] = translatedText;
        
        const cacheKey = getCacheKey(originalText, currentLanguage, context);
        newCacheEntries[cacheKey] = translatedText;
      });

      setCache(prev => ({ ...prev, ...newCacheEntries }));

      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Fill remaining results with original texts
      uncachedIndices.forEach((index, i) => {
        results[index] = uncachedTexts[i];
      });
      return results;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, cache, getCacheKey]);

  // Translate text asynchronously with reduced API calls
  const translate = useCallback(async (text: string, context?: string): Promise<string> => {
    // Return original text if current language is English
    if (currentLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = getCacheKey(text, currentLanguage, context);
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    // Use batch translation for better performance
    const result = await translateBatch([text], context);
    return result[0] || text;
  }, [currentLanguage, cache, getCacheKey, translateBatch]);

  // Synchronous translation (returns cached or original text)
  const translateSync = useCallback((text: string, context?: string): string => {
    if (currentLanguage === 'en') {
      return text;
    }

    const cacheKey = getCacheKey(text, currentLanguage, context);
    return cache[cacheKey] || text;
  }, [currentLanguage, cache, getCacheKey]);

  const value: TranslationContextType = {
    currentLanguage,
    setLanguage,
    translate,
    translateSync,
    isLoading,
    translateBatch,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};