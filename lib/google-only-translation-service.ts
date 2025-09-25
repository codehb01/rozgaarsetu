import prisma from './prisma';
import { GoogleTranslatorService } from './google-translator';
import crypto from 'crypto';

export type ContentType = 'review' | 'job' | 'bio' | 'description' | 'title' | 'other';
export type Language = 'en' | 'hi' | 'mr';

export class GoogleOnlyTranslationService {
  private googleTranslator: GoogleTranslatorService;

  constructor(googleApiKey?: string) {
    // Use provided key or fall back to environment variable
    const apiKey = googleApiKey || process.env.GOOGLE_TRANSLATE_API_KEY;
    this.googleTranslator = new GoogleTranslatorService(apiKey);
  }

  /**
   * Generate a unique hash key for caching translations
   */
  private generateHashKey(text: string, sourceLang: string, targetLang: string): string {
    const content = `${text}:${sourceLang}:${targetLang}:google`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Get translation from cache or translate using Google and cache the result
   */
  async translateWithCache(
    text: string,
    targetLanguage: Language,
    sourceLanguage: Language = 'en',
    contentType: ContentType = 'other',
    contentId?: string
  ): Promise<string> {
    // Return original text if same language
    if (sourceLanguage === targetLanguage) {
      console.log(`🔄 Same language (${sourceLanguage} -> ${targetLanguage}), returning original text`);
      return text;
    }

    // Generate hash key for caching
    const hashKey = this.generateHashKey(text, sourceLanguage, targetLanguage);
    console.log(`🔍 Looking for translation cache with hash: ${hashKey.substring(0, 16)}...`);

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

        console.log(`✅ 🚀 CACHE HIT (GOOGLE)! Found cached translation for: "${text.substring(0, 50)}..."`);
        console.log(`📅 Original cached: ${cachedTranslation.createdAt}, Last accessed: ${cachedTranslation.lastAccessedAt}`);
        return cachedTranslation.translatedText;
      }

      // Cache miss - translate using Google
      console.log(`❌ 🔄 CACHE MISS (GOOGLE) - Translating: "${text.substring(0, 50)}..."`);
      const googleResult = await this.googleTranslator.translateText(text, targetLanguage, sourceLanguage);
      
      // Extract the translated text from Google response
      const translatedText = googleResult[0]?.translatedText || text;
      console.log(`🤖 Google translation result: "${translatedText.substring(0, 50)}..."`);

      // Store in cache
      const cacheEntry = await prisma.translationCache.create({
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

      console.log(`💾 ✅ CACHED! Stored translation with ID: ${cacheEntry.id}`);
      return translatedText;
    } catch (error) {
      console.error('❌ Google Translation error:', error);
      // Fallback to original text if translation fails
      return text;
    }
  }

  /**
   * Translate multiple texts in batch for better performance
   */
  async translateBatch(
    items: Array<{
      text: string;
      targetLanguage: Language;
      sourceLanguage?: Language;
      contentType?: ContentType;
      contentId?: string;
    }>
  ): Promise<string[]> {
    const translations = await Promise.all(
      items.map(item => 
        this.translateWithCache(
          item.text,
          item.targetLanguage,
          item.sourceLanguage || 'en',
          item.contentType || 'other',
          item.contentId
        )
      )
    );
    
    return translations;
  }

  /**
   * Clear old cache entries (for maintenance)
   */
  async cleanupOldCache(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.translationCache.deleteMany({
      where: {
        lastAccessedAt: {
          lt: cutoffDate
        }
      }
    });

    console.log(`🧹 Cleaned up ${result.count} old translation cache entries`);
    return result.count;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    byContentType: Record<string, number>;
    byLanguagePair: Record<string, number>;
  }> {
    const totalEntries = await prisma.translationCache.count();
    
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
      byContentType: Object.fromEntries(
        byContentType.map((item: any) => [item.contentType, item._count.id])
      ),
      byLanguagePair: Object.fromEntries(
        byLanguagePair.map((item: any) => [`${item.sourceLanguage}->${item.targetLanguage}`, item._count.id])
      )
    };
  }

  /**
   * Pre-warm cache for common content
   */
  async preWarmCache(
    texts: string[],
    targetLanguages: Language[],
    sourceLanguage: Language = 'en',
    contentType: ContentType = 'other'
  ): Promise<void> {
    console.log(`🔥 Pre-warming cache for ${texts.length} texts in ${targetLanguages.length} languages`);
    
    for (const text of texts) {
      for (const targetLang of targetLanguages) {
        if (targetLang !== sourceLanguage) {
          await this.translateWithCache(text, targetLang, sourceLanguage, contentType);
        }
      }
    }
    
    console.log('✅ Cache pre-warming completed');
  }
}

// Export singleton instance
export const googleTranslationService = new GoogleOnlyTranslationService();