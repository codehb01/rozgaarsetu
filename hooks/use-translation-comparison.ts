import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

export interface TranslationResult {
  translatedText: string;
  provider: 'azure' | 'google';
  duration: number;
  fromCache: boolean;
  error?: string;
}

export interface PerformanceComparison {
  azure: TranslationResult;
  google: TranslationResult;
  winner: 'azure' | 'google';
  speedDifference: number;
}

export function useTranslationComparison(
  originalText: string,
  contentId: string,
  googleApiKey: string = '', // Make default empty string
  contentType: 'review' | 'job' | 'bio' | 'description' | 'title' | 'other' = 'other'
) {
  const { language } = useLanguage();
  const [comparison, setComparison] = useState<PerformanceComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalText || language === 'en') {
      setComparison(null);
      return;
    }

    const performComparison = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translate-compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: originalText,
            targetLanguage: language,
            sourceLanguage: 'en',
            contentType,
            contentId,
            ...(googleApiKey && { googleApiKey }) // Only include if provided
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation comparison failed');
        }

        const data = await response.json();
        setComparison(data.comparison);
      } catch (err) {
        console.error('Translation comparison error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    performComparison();
  }, [originalText, language, contentId, googleApiKey, contentType]);

  return { comparison, isLoading, error };
}