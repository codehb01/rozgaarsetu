'use client';

import { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';
import { useTranslation } from './use-translation';

interface BatchTranslationRequest {
  text: string;
  context?: string;
  resolve: (result: string) => void;
}

interface BatchTranslationContextType {
  requestTranslation: (text: string, context?: string) => Promise<string>;
}

const BatchTranslationContext = createContext<BatchTranslationContextType | null>(null);

export function BatchTranslationProvider({ children }: { children: React.ReactNode }) {
  const { translateBatch, currentLanguage } = useTranslation();
  const pendingRequests = useRef<BatchTranslationRequest[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processBatch = useCallback(async () => {
    if (pendingRequests.current.length === 0) return;

    const requests = [...pendingRequests.current];
    pendingRequests.current = [];

    // Group requests by context for better batching
    const contextGroups = new Map<string, BatchTranslationRequest[]>();
    
    requests.forEach(request => {
      const contextKey = request.context || 'default';
      if (!contextGroups.has(contextKey)) {
        contextGroups.set(contextKey, []);
      }
      contextGroups.get(contextKey)!.push(request);
    });

    // Process each context group
    const promises = Array.from(contextGroups.entries()).map(async ([context, groupRequests]) => {
      try {
        const texts = groupRequests.map(req => req.text);
        const actualContext = context === 'default' ? undefined : context;
        
        const results = await translateBatch(texts, actualContext);
        
        groupRequests.forEach((request, index) => {
          request.resolve(results[index] || request.text);
        });
      } catch (error) {
        console.error(`Batch translation failed for context ${context}:`, error);
        groupRequests.forEach(request => {
          request.resolve(request.text);
        });
      }
    });

    await Promise.all(promises);
  }, [translateBatch]);

  const requestTranslation = useCallback((text: string, context?: string): Promise<string> => {
    if (currentLanguage === 'en') {
      return Promise.resolve(text);
    }

    return new Promise<string>((resolve) => {
      pendingRequests.current.push({ text, context, resolve });

      // Clear existing timeout and set a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Process batch after a short delay to collect more requests
      timeoutRef.current = setTimeout(() => {
        processBatch();
      }, 100); // 100ms delay to batch more requests together
    });
  }, [currentLanguage, processBatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <BatchTranslationContext.Provider value={{ requestTranslation }}>
      {children}
    </BatchTranslationContext.Provider>
  );
}

export function useBatchTranslation() {
  const context = useContext(BatchTranslationContext);
  if (!context) {
    throw new Error('useBatchTranslation must be used within BatchTranslationProvider');
  }
  return context;
}

// TranslatedText component for batch translation
export function TranslatedText({ 
  children, 
  context 
}: { 
  children: React.ReactNode; 
  context?: string; 
}) {
  const { requestTranslation } = useBatchTranslation();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const text = typeof children === 'string' ? children : String(children);
    
    if (text.trim()) {
      setIsLoading(true);
      requestTranslation(text, context)
        .then(result => {
          setTranslatedText(result);
          setIsLoading(false);
        })
        .catch(() => {
          setTranslatedText(text); // Fallback to original
          setIsLoading(false);
        });
    } else {
      setTranslatedText(text);
      setIsLoading(false);
    }
  }, [children, context, requestTranslation]);

  if (isLoading) {
    return <>{children}</>;
  }

  return <>{translatedText}</>;
}