import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

export function useGoogleTranslation(
  originalText: string,
  contentId: string,
  contentType: 'review' | 'job' | 'bio' | 'description' | 'title' | 'other' = 'other'
) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalText || language === 'en') {
      setTranslatedText(originalText);
      setError(null);
      return;
    }

    const performTranslation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translate-google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: originalText,
            targetLanguage: language,
            sourceLanguage: 'en',
            contentType,
            contentId
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation failed');
        }

        const data = await response.json();
        setTranslatedText(data.translatedText);
      } catch (err) {
        console.error('Google translation error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTranslatedText(originalText); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [originalText, language, contentId, contentType]);

  return { translatedText, isLoading, error };
}

// Specific hooks for different content types
export function useGoogleReviewTranslation(text: string, reviewId: string) {
  return useGoogleTranslation(text, reviewId, 'review');
}

export function useGoogleJobTranslation(text: string, jobId: string) {
  return useGoogleTranslation(text, jobId, 'job');
}

export function useGoogleBioTranslation(text: string, workerId: string) {
  return useGoogleTranslation(text, workerId, 'bio');
}