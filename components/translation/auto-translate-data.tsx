'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { contentScanner } from '@/lib/content-scanner';

interface AutoTranslateDataProps {
  data: any;
  context?: string;
  children: (translatedData: any, isLoading: boolean) => React.ReactNode;
}

/**
 * Component that automatically translates data structures
 */
export const AutoTranslateData: React.FC<AutoTranslateDataProps> = ({
  data,
  context = 'data',
  children
}) => {
  const { currentLanguage } = useTranslation();
  const [translatedData, setTranslatedData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedData(data);
      return;
    }

    setIsLoading(true);
    contentScanner
      .autoTranslateComponentData(data, currentLanguage, context)
      .then(setTranslatedData)
      .catch(() => setTranslatedData(data))
      .finally(() => setIsLoading(false));
  }, [data, currentLanguage, context]);

  return <>{children(translatedData, isLoading)}</>;
};

/**
 * HOC that automatically translates component data
 */
export function withAutoTranslation<P extends { data?: any }>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    dataKey?: keyof P;
    context?: string;
    loadingComponent?: React.ComponentType;
  } = {}
) {
  const { dataKey = 'data', context = 'component', loadingComponent: LoadingComponent } = options;

  return function AutoTranslatedComponent(props: P) {
    const { currentLanguage } = useTranslation();
    const [translatedData, setTranslatedData] = useState(props[dataKey]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const dataToTranslate = props[dataKey];
      if (!dataToTranslate || currentLanguage === 'en') {
        setTranslatedData(dataToTranslate);
        return;
      }

      setIsLoading(true);
      contentScanner
        .autoTranslateComponentData(dataToTranslate, currentLanguage, context)
        .then(setTranslatedData)
        .catch(() => setTranslatedData(dataToTranslate))
        .finally(() => setIsLoading(false));
    }, [props[dataKey], currentLanguage]);

    if (isLoading && LoadingComponent) {
      return <LoadingComponent />;
    }

    const enhancedProps = {
      ...props,
      [dataKey]: translatedData,
      isTranslating: isLoading
    } as P;

    return <WrappedComponent {...enhancedProps} />;
  };
}

interface SmartTranslateProps {
  text: string;
  context?: string;
  fallback?: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * Smart component that detects and translates text content
 */
export const SmartTranslate: React.FC<SmartTranslateProps> = ({
  text,
  context,
  fallback,
  className,
  as: Component = 'span'
}) => {
  const { translate, translateSync, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  const isTranslatable = useMemo(() => {
    return contentScanner['isTranslatableText'](text);
  }, [text]);

  useEffect(() => {
    if (!isTranslatable || currentLanguage === 'en') {
      setTranslatedText(text);
      return;
    }

    // Try sync translation first
    const syncResult = translateSync(text, context);
    if (syncResult !== text) {
      setTranslatedText(syncResult);
      return;
    }

    // Async translation
    translate(text, context)
      .then(setTranslatedText)
      .catch(() => setTranslatedText(fallback || text));
  }, [text, context, currentLanguage, isTranslatable, translate, translateSync, fallback]);

  return <Component className={className}>{translatedText}</Component>;
};

/**
 * Hook for auto-translating arrays of objects
 */
export const useAutoTranslateArray = <T extends Record<string, any>>(
  items: T[],
  context: string = 'array'
): { translatedItems: T[]; isLoading: boolean } => {
  const { currentLanguage } = useTranslation();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en' || !items.length) {
      setTranslatedItems(items);
      return;
    }

    setIsLoading(true);
    
    Promise.all(
      items.map(item => 
        contentScanner.autoTranslateComponentData(item, currentLanguage, context)
      )
    )
      .then(setTranslatedItems)
      .catch(() => setTranslatedItems(items))
      .finally(() => setIsLoading(false));
  }, [items, currentLanguage, context]);

  return { translatedItems, isLoading };
};

/**
 * Component for translating lists with loading states
 */
interface AutoTranslateListProps<T> {
  items: T[];
  context?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  className?: string;
}

export function AutoTranslateList<T extends Record<string, any>>({
  items,
  context = 'list',
  renderItem,
  renderLoading,
  className
}: AutoTranslateListProps<T>) {
  const { translatedItems, isLoading } = useAutoTranslateArray(items, context);

  if (isLoading && renderLoading) {
    return <div className={className}>{renderLoading()}</div>;
  }

  return (
    <div className={className}>
      {translatedItems.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}