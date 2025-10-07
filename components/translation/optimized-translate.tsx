'use client';

import { useTranslation } from '@/hooks/use-translation';
import { useState, useEffect, useRef } from 'react';
import { BatchProcessor, TTLCache } from '@/lib/optimization-utils';

interface QueuedTranslation {
  text: string;
  context?: string;
  resolve: (translation: string) => void;
  reject: (error: any) => void;
}

class TranslationManager {
  private static instance: TranslationManager;
  private batchProcessor: BatchProcessor<{ text: string; context?: string }, string>;
  private cache: TTLCache<string, string>;

  private constructor() {
    this.cache = new TTLCache<string, string>(10 * 60 * 1000); // 10 minutes cache

    this.batchProcessor = new BatchProcessor(
      async (items: { text: string; context?: string }[]) => {
        const texts = items.map(item => item.text);
        const primaryContext = items[0]?.context || 'batch';

        const response = await fetch('/api/translate/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts,
            targetLanguage: (window as any).currentTranslationLanguage || 'en',
            sourceLanguage: 'en',
            context: primaryContext
          })
        });

        if (!response.ok) throw new Error('Batch translation failed');

        const result = await response.json();
        const translations = result.data.translations;

        // Cache the results
        translations.forEach((translation: any, index: number) => {
          const originalText = texts[index];
          const translatedText = translation.translatedText;
          const cacheKey = `${originalText}|${(window as any).currentTranslationLanguage || 'en'}|${primaryContext}`;
          this.cache.set(cacheKey, translatedText);
        });

        return translations.map((t: any) => t.translatedText);
      },
      { batchSize: 15, delay: 150 } // Batch up to 15 items, wait 150ms
    );
  }

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager();
    }
    return TranslationManager.instance;
  }

  async translate(text: string, context?: string): Promise<string> {
    const currentLanguage = (window as any).currentTranslationLanguage || 'en';
    
    if (currentLanguage === 'en') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}|${currentLanguage}|${context || 'default'}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Add to batch processor
    return this.batchProcessor.add({ text, context });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Optimized translation hook that uses batching
 */
export const useOptimizedTranslation = (text: string, context?: string) => {
  const { currentLanguage, translateSync } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState(false);
  const translationManager = useRef(TranslationManager.getInstance());

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    // Try sync translation first (from cache)
    const syncResult = translateSync(text, context);
    if (syncResult !== text) {
      setTranslatedText(syncResult);
      return;
    }

    // Add to batch queue
    setIsLoading(true);
    (window as any).currentTranslationLanguage = currentLanguage;
    
    translationManager.current.translate(text, context)
      .then((result: string) => {
        setTranslatedText(result);
        setIsLoading(false);
      })
      .catch(() => {
        setTranslatedText(text);
        setIsLoading(false);
      });
  }, [text, context, currentLanguage, translateSync]);

  return { translatedText, isLoading, originalText: text };
};

/**
 * Optimized TranslatedText component with batching
 */
interface OptimizedTranslatedTextProps {
  children: string;
  context?: string;
  fallback?: string;
  showLoading?: boolean;
}

export const OptimizedTranslatedText: React.FC<OptimizedTranslatedTextProps> = ({ 
  children, 
  context, 
  fallback,
  showLoading = false
}) => {
  const { translatedText, isLoading } = useOptimizedTranslation(children, context);

  if (showLoading && isLoading) {
    return <span className="opacity-70">{children}</span>;
  }

  return <>{translatedText}</>;
};