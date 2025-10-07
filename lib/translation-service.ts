import prisma from './prisma';
import crypto from 'crypto';

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  cached: boolean;
}

export class TranslationService {
  private static instance: TranslationService;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || '';
    // Only validate API key on server-side (in API routes)
    if (typeof window === 'undefined' && !this.apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not set in environment variables');
    }
  }

  static getInstance(): TranslationService {
    // Only create instance on server-side
    if (typeof window !== 'undefined') {
      throw new Error('TranslationService can only be used on the server-side');
    }
    
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Generate a unique hash key for caching
   */
  private generateHashKey(text: string, sourceLanguage: string, targetLanguage: string, context?: string): string {
    const content = `${text}|${sourceLanguage}|${targetLanguage}|${context || ''}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Check if translation exists in cache
   */
  private async getFromCache(hashKey: string): Promise<string | null> {
    try {
      const cached = await prisma.translationCache.findUnique({
        where: { hashKey }
      });

      if (cached) {
        // Update last accessed time
        await prisma.translationCache.update({
          where: { hashKey },
          data: { lastAccessedAt: new Date() }
        });
        return cached.translatedText;
      }
      return null;
    } catch (error) {
      console.error('Error fetching from translation cache:', error);
      return null;
    }
  }

  /**
   * Store translation in cache
   */
  private async storeInCache(
    hashKey: string,
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: string
  ): Promise<void> {
    try {
      await prisma.translationCache.upsert({
        where: { hashKey },
        create: {
          id: crypto.randomUUID(),
          hashKey,
          originalText,
          translatedText,
          sourceLanguage,
          targetLanguage,
          context,
        },
        update: {
          lastAccessedAt: new Date(),
          // Optionally update the translation if it's different
          translatedText,
        }
      });
    } catch (error) {
      console.error('Error storing translation in cache:', error);
    }
  }

  /**
   * Call Google Translate API
   */
  private async translateWithGoogle(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<{ translatedText: string; detectedSourceLanguage?: string }> {
    // Server-side API key check
    if (!this.apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured');
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
    
    const requestBody: any = {
      q: text,
      target: targetLanguage,
      format: 'text'
    };

    if (sourceLanguage) {
      requestBody.source = sourceLanguage;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data.translations || data.data.translations.length === 0) {
        throw new Error('Invalid response from Google Translate API');
      }

      const translation = data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      };
    } catch (error) {
      console.error('Google Translate API error:', error);
      throw new Error('Translation service unavailable');
    }
  }

  /**
   * Main translation method with intelligent caching
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, targetLanguage, sourceLanguage = 'en', context } = request;

    // Don't translate if target language is same as source
    if (sourceLanguage === targetLanguage) {
      return {
        translatedText: text,
        cached: false
      };
    }

    // Generate hash key for caching
    const hashKey = this.generateHashKey(text, sourceLanguage, targetLanguage, context);

    // Check cache first
    const cachedTranslation = await this.getFromCache(hashKey);
    if (cachedTranslation) {
      return {
        translatedText: cachedTranslation,
        cached: true
      };
    }

    // Translate using Google API
    const googleResult = await this.translateWithGoogle(text, targetLanguage, sourceLanguage);
    
    // Store in cache for future use
    await this.storeInCache(
      hashKey,
      text,
      googleResult.translatedText,
      googleResult.detectedSourceLanguage || sourceLanguage,
      targetLanguage,
      context
    );

    return {
      translatedText: googleResult.translatedText,
      detectedSourceLanguage: googleResult.detectedSourceLanguage,
      cached: false
    };
  }

  /**
   * Batch translate multiple texts
   */
  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage: string = 'en', context?: string): Promise<TranslationResponse[]> {
    const promises = texts.map(text => 
      this.translate({ text, targetLanguage, sourceLanguage, context })
    );
    
    return Promise.all(promises);
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<{ code: string; name: string }[]> {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'mr', name: 'Marathi' }
    ];
  }

  /**
   * Clear cache entries older than specified days
   */
  async clearOldCache(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await prisma.translationCache.deleteMany({
        where: {
          lastAccessedAt: {
            lt: cutoffDate
          }
        }
      });

      return result.count;
    } catch (error) {
      console.error('Error clearing old cache:', error);
      return 0;
    }
  }
}

// Export a function to get the service instance only on server-side
export const getTranslationService = () => TranslationService.getInstance();