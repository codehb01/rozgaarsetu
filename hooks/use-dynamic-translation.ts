import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import type { ContentType } from '@/lib/translation-service';

interface UseTranslationOptions {
  contentType?: ContentType;
  contentId?: string;
  enabled?: boolean;
}

export function useDynamicTranslation(
  originalText: string | string[],
  options: UseTranslationOptions = {}
) {
  const { language, translateText, translateBatch, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | string[]>(originalText);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contentType = 'other', contentId, enabled = true } = options;

  useEffect(() => {
    if (!enabled || language === 'en') {
      setTranslatedText(originalText);
      return;
    }

    if (!originalText || (Array.isArray(originalText) && originalText.length === 0)) {
      return;
    }

    // Skip translation if no valid translation functions available
    if (!translateText || !translateBatch) {
      console.warn('Translation functions not available, using original text');
      setTranslatedText(originalText);
      return;
    }

    let isCancelled = false;
    
    const performTranslation = async () => {
      if (isTranslating) return; // Skip if already translating

      setIsLoading(true);
      setError(null);

      try {
        if (Array.isArray(originalText)) {
          // Batch translation
          const items = originalText.map(text => ({
            text,
            contentType,
            contentId,
          }));

          const translations = await translateBatch(items);
          
          if (!isCancelled) {
            setTranslatedText(translations);
          }
        } else {
          // Single translation
          const translation = await translateText(originalText, language, contentType, contentId);
          
          if (!isCancelled) {
            setTranslatedText(translation);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Translation failed';
        console.warn('Translation error in useDynamicTranslation:', errorMessage);
        
        if (!isCancelled) {
          // Don't set error state for network issues - just use original text
          if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
            console.log('Network error detected, using original text without showing error');
            setError(null);
          } else {
            setError(errorMessage);
          }
          setTranslatedText(originalText); // Fallback to original text
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    performTranslation();

    return () => {
      isCancelled = true;
    };
  }, [originalText, language, contentType, contentId, enabled, translateText, translateBatch, isTranslating]);

  return {
    translatedText,
    isLoading: isLoading || isTranslating,
    error,
    originalText,
    language,
  };
}

// Hook specifically for reviews
export function useReviewTranslation(reviewText: string, reviewId: string) {
  return useDynamicTranslation(reviewText, {
    contentType: 'review',
    contentId: reviewId,
    enabled: !!reviewText,
  });
}

// Hook specifically for job descriptions
export function useJobTranslation(jobDescription: string, jobId: string) {
  return useDynamicTranslation(jobDescription, {
    contentType: 'job',
    contentId: jobId,
    enabled: !!jobDescription,
  });
}

// Hook specifically for worker bios
export function useBioTranslation(bio: string, workerId: string) {
  return useDynamicTranslation(bio, {
    contentType: 'bio',
    contentId: workerId,
    enabled: !!bio,
  });
}

// Hook for batch content translation (e.g., multiple reviews, job listings)
export function useBatchTranslation(
  items: Array<{ text: string; id: string }>,
  contentType: ContentType
) {
  const texts = items.map(item => item.text);
  const contentId = items.map(item => item.id).join(','); // Combined ID for batch

  const result = useDynamicTranslation(texts, {
    contentType,
    contentId,
    enabled: items.length > 0,
  });

  // Return with individual mapping
  const translatedItems = Array.isArray(result.translatedText)
    ? items.map((item, index) => ({
        ...item,
        translatedText: result.translatedText[index] || item.text,
      }))
    : items.map(item => ({
        ...item,
        translatedText: item.text, // Fallback
      }));

  return {
    ...result,
    translatedItems,
  };
}