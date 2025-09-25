import prisma from './prisma';
import { AzureTranslatorService } from './azure-translator';
import { GoogleTranslatorService } from './google-translator';
import crypto from 'crypto';

export type ContentType = 'review' | 'job' | 'bio' | 'description' | 'title' | 'other';
export type Language = 'en' | 'hi' | 'mr';
export type TranslationProvider = 'azure' | 'google';

export interface TranslationResult {
  translatedText: string;
  provider: TranslationProvider;
  duration: number; // in milliseconds
  fromCache: boolean;
  error?: string;
}

export interface PerformanceComparison {
  azure: TranslationResult;
  google: TranslationResult;
  winner: TranslationProvider;
  speedDifference: number; // percentage faster
}

export class EnhancedTranslationService {
  private azureTranslator: AzureTranslatorService;
  private googleTranslator: GoogleTranslatorService;

  constructor(googleApiKey?: string) {
    this.azureTranslator = new AzureTranslatorService();
    // Use provided key or fall back to environment variable
    const apiKey = googleApiKey || process.env.GOOGLE_TRANSLATE_API_KEY;
    this.googleTranslator = new GoogleTranslatorService(apiKey);
  }

  /**
   * Generate a unique hash key for caching translations
   */
  private generateHashKey(text: string, sourceLang: string, targetLang: string, provider: TranslationProvider): string {
    const content = `${text}:${sourceLang}:${targetLang}:${provider}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Translate using a specific provider with performance measurement
   */
  async translateWithProvider(
    text: string,
    targetLanguage: Language,
    sourceLanguage: Language = 'en',
    provider: TranslationProvider,
    contentType: ContentType = 'other',
    contentId?: string
  ): Promise<TranslationResult> {
    const startTime = Date.now();
    
    // Return original text if same language
    if (sourceLanguage === targetLanguage) {
      return {
        translatedText: text,
        provider,
        duration: 0,
        fromCache: false
      };
    }

    // Generate hash key for caching
    const hashKey = this.generateHashKey(text, sourceLanguage, targetLanguage, provider);
    
    try {
      // Try to get from cache first
      const cachedTranslation = await prisma.translationCache.findUnique({
        where: { hashKey }
      });

      if (cachedTranslation) {
        // Update last accessed time for cache management
        await prisma.translationCache.update({
          where: { id: cachedTranslation.id },
          data: { lastAccessedAt: new Date() }
        });

        const duration = Date.now() - startTime;
        console.log(`✅ 🚀 CACHE HIT (${provider.toUpperCase()})! Found cached translation for: "${text.substring(0, 50)}..."`);
        
        return {
          translatedText: cachedTranslation.translatedText,
          provider,
          duration,
          fromCache: true
        };
      }

      // Cache miss - translate using specified provider
      console.log(`❌ 🔄 CACHE MISS (${provider.toUpperCase()}) - Translating: "${text.substring(0, 50)}..."`);
      
      let translatedText: string;
      const translationStartTime = Date.now();

      if (provider === 'azure') {
        const azureResult = await this.azureTranslator.translateText(text, targetLanguage, sourceLanguage);
        translatedText = azureResult[0]?.translations?.[0]?.text || text;
      } else {
        const googleResult = await this.googleTranslator.translateText(text, targetLanguage, sourceLanguage);
        translatedText = googleResult[0]?.translatedText || text;
      }

      const translationDuration = Date.now() - translationStartTime;
      const totalDuration = Date.now() - startTime;

      console.log(`🤖 ${provider.toUpperCase()} translation result: "${translatedText.substring(0, 50)}..." (${translationDuration}ms)`);

      // Store in cache
      await prisma.translationCache.create({
        data: {
          originalText: text,
          translatedText,
          sourceLanguage,
          targetLanguage,
          contentType,
          contentId,
          hashKey,
          lastAccessedAt: new Date()
        }
      });

      return {
        translatedText,
        provider,
        duration: totalDuration,
        fromCache: false
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ ${provider.toUpperCase()} Translation error:`, error);
      
      return {
        translatedText: text,
        provider,
        duration,
        fromCache: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Compare translation performance between Azure and Google
   */
  async compareTranslationPerformance(
    text: string,
    targetLanguage: Language,
    sourceLanguage: Language = 'en',
    contentType: ContentType = 'other',
    contentId?: string
  ): Promise<PerformanceComparison> {
    console.log(`🏁 Starting performance comparison for: "${text.substring(0, 50)}..."`);
    
    // Run both translations in parallel
    const [azureResult, googleResult] = await Promise.all([
      this.translateWithProvider(text, targetLanguage, sourceLanguage, 'azure', contentType, contentId),
      this.translateWithProvider(text, targetLanguage, sourceLanguage, 'google', contentType, contentId)
    ]);

    // Determine winner and calculate speed difference
    let winner: TranslationProvider;
    let speedDifference: number;

    if (azureResult.duration < googleResult.duration) {
      winner = 'azure';
      speedDifference = ((googleResult.duration - azureResult.duration) / googleResult.duration) * 100;
    } else {
      winner = 'google';
      speedDifference = ((azureResult.duration - googleResult.duration) / azureResult.duration) * 100;
    }

    console.log(`🏆 Winner: ${winner.toUpperCase()} (${speedDifference.toFixed(1)}% faster)`);
    console.log(`⚡ Azure: ${azureResult.duration}ms ${azureResult.fromCache ? '(cached)' : '(fresh)'}`);
    console.log(`⚡ Google: ${googleResult.duration}ms ${googleResult.fromCache ? '(cached)' : '(fresh)'}`);

    return {
      azure: azureResult,
      google: googleResult,
      winner,
      speedDifference
    };
  }

  /**
   * Get cache statistics for both providers
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    byProvider: Record<string, number>;
    byContentType: Record<string, number>;
    byLanguagePair: Record<string, number>;
  }> {
    const totalEntries = await prisma.translationCache.count();
    
    // Note: We don't have provider info in current cache schema
    // This would need a schema update to track provider in cache
    const byContentType = await prisma.translationCache.groupBy({
      by: ['contentType'],
      _count: { id: true }
    });

    const byLanguagePair = await prisma.translationCache.groupBy({
      by: ['sourceLanguage', 'targetLanguage'],
      _count: { id: true }
    });

    return {
      totalEntries,
      byProvider: { azure: 0, google: 0 }, // Would need schema update
      byContentType: Object.fromEntries(
        byContentType.map((item: any) => [item.contentType, item._count.id])
      ),
      byLanguagePair: Object.fromEntries(
        byLanguagePair.map((item: any) => [`${item.sourceLanguage}->${item.targetLanguage}`, item._count.id])
      )
    };
  }
}

// Export singleton instance
export const enhancedTranslationService = new EnhancedTranslationService();