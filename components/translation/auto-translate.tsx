'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useBatchTranslation } from '@/hooks/use-batch-translation';

interface TranslatedTextProps {
  children: string;
  context?: string;
  fallback?: string;
}

/**
 * Component that automatically translates its text content
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  context, 
  fallback 
}) => {
  const { translateSync, currentLanguage } = useTranslation();
  const { requestTranslation } = useBatchTranslation();
  const [translatedText, setTranslatedText] = useState<string>(children);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(children);
      return;
    }

    // Try sync translation first (from cache)
    const syncResult = translateSync(children, context);
    if (syncResult !== children) {
      setTranslatedText(syncResult);
      return;
    }

    // If not in cache, use batch translation
    requestTranslation(children, context)
      .then(result => setTranslatedText(result))
      .catch(() => setTranslatedText(fallback || children));
  }, [children, context, currentLanguage, requestTranslation, translateSync, fallback]);

  return <>{translatedText}</>;
};

interface AutoTranslateProps {
  text: string;
  context?: string;
  render?: (translatedText: string, isLoading: boolean) => React.ReactNode;
  fallback?: string;
}

/**
 * Component for rendering translated text with loading state
 */
export const AutoTranslate: React.FC<AutoTranslateProps> = ({ 
  text, 
  context, 
  render,
  fallback 
}) => {
  const { translate, translateSync, currentLanguage, isLoading } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState(false);

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

    // If not in cache, translate asynchronously
    setIsTranslating(true);
    translate(text, context)
      .then(result => setTranslatedText(result))
      .catch(() => setTranslatedText(fallback || text))
      .finally(() => setIsTranslating(false));
  }, [text, context, currentLanguage, translate, translateSync, fallback]);

  if (render) {
    return <>{render(translatedText, isTranslating || isLoading)}</>;
  }

  return <>{translatedText}</>;
};

/**
 * HOC to automatically translate static text content in components
 */
export function withTranslation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  textExtractor?: (props: P) => string[],
  context?: string
) {
  return function TranslatedComponent(props: P) {
    const { translateBatch, currentLanguage } = useTranslation();
    const [translatedTexts, setTranslatedTexts] = useState<string[]>([]);

    useEffect(() => {
      if (currentLanguage === 'en' || !textExtractor) {
        return;
      }

      const textsToTranslate = textExtractor(props);
      if (textsToTranslate.length === 0) return;

      translateBatch(textsToTranslate, context)
        .then(setTranslatedTexts)
        .catch(() => setTranslatedTexts(textsToTranslate));
    }, [props, currentLanguage, translateBatch]);

    // Pass translated texts as additional props
    const enhancedProps = {
      ...props,
      translatedTexts: currentLanguage === 'en' ? [] : translatedTexts,
    };

    return <WrappedComponent {...enhancedProps} />;
  };
}

/**
 * Hook for manual text translation with loading state
 */
export const useTextTranslation = (text: string, context?: string) => {
  const { translate, translateSync, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState(false);

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

    // If not in cache, translate asynchronously
    setIsTranslating(true);
    translate(text, context)
      .then(result => setTranslatedText(result))
      .catch(() => setTranslatedText(text))
      .finally(() => setIsTranslating(false));
  }, [text, context, currentLanguage, translate, translateSync]);

  return {
    translatedText,
    isTranslating,
    originalText: text
  };
};