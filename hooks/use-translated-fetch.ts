'use client';

import { useTranslation } from '@/hooks/use-translation';
import { useCallback } from 'react';

/**
 * Hook for making API calls with automatic translation
 */
export const useTranslatedFetch = () => {
  const { currentLanguage } = useTranslation();

  const translatedFetch = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add translation header if not English
    if (currentLanguage !== 'en') {
      (headers as any)['x-translate-to'] = currentLanguage;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [currentLanguage]);

  const get = useCallback(async (url: string) => {
    const response = await translatedFetch(url);
    return response.json();
  }, [translatedFetch]);

  const post = useCallback(async (url: string, data: any) => {
    const response = await translatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }, [translatedFetch]);

  const put = useCallback(async (url: string, data: any) => {
    const response = await translatedFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }, [translatedFetch]);

  const del = useCallback(async (url: string) => {
    const response = await translatedFetch(url, {
      method: 'DELETE',
    });
    return response.json();
  }, [translatedFetch]);

  return {
    get,
    post,
    put,
    delete: del,
    fetch: translatedFetch,
  };
};