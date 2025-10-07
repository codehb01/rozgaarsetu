import { NextRequest, NextResponse } from 'next/server';
import { contentScanner } from '@/lib/content-scanner';

/**
 * Middleware-like function to automatically translate API responses
 */
export async function withTranslation(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    translateFields?: string[];
    context?: string;
  } = {}
) {
  return async (request: NextRequest) => {
    const response = await handler(request);
    
    // Only process JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return response;
    }

    // Check if client requested translation
    const targetLanguage = request.headers.get('x-translate-to');
    if (!targetLanguage || targetLanguage === 'en') {
      return response;
    }

    try {
      const responseData = await response.json();
      
      // Auto-translate the response data
      const translatedData = await contentScanner.autoTranslateComponentData(
        responseData,
        targetLanguage,
        options.context || 'api'
      );

      return NextResponse.json(translatedData, {
        status: response.status,
        headers: response.headers
      });
    } catch (error) {
      console.error('Translation middleware error:', error);
      return response; // Return original response on error
    }
  };
}

/**
 * Helper function to add translation headers to API requests
 */
export function createTranslatedFetch(targetLanguage: string) {
  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'x-translate-to': targetLanguage,
      'Content-Type': 'application/json'
    };

    return fetch(url, {
      ...options,
      headers
    });
  };
}

/**
 * Hook for making translated API calls
 */
export function useTranslatedApi() {
  return {
    get: async (url: string, targetLanguage: string = 'en') => {
      const response = await createTranslatedFetch(targetLanguage)(url);
      return response.json();
    },
    
    post: async (url: string, data: any, targetLanguage: string = 'en') => {
      const response = await createTranslatedFetch(targetLanguage)(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    }
  };
}