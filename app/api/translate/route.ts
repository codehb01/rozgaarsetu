import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/lib/translation-service';
import { AzureTranslatorService } from '@/lib/azure-translator';

export async function POST(request: NextRequest) {
  try {
    // Check if Azure credentials are available
    if (!process.env.AZURE_TRANSLATOR_KEY) {
      return NextResponse.json(
        { error: 'Azure Translator is not configured', details: 'Missing AZURE_TRANSLATOR_KEY' },
        { status: 503 }
      );
    }
    
    const body = await request.json();
    const { 
      text, 
      targetLanguage, 
      sourceLanguage = 'en',
      contentType = 'other',
      contentId,
      useCache = true
    } = body;

    console.log('🔧 Translation request received:', { 
      text: text.substring(0, 50) + '...', 
      targetLanguage, 
      sourceLanguage,
      contentType,
      useCache,
      timestamp: new Date().toISOString()
    });

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    let translatedText: string;

    if (useCache) {
      // Use hybrid service with database caching
      console.log('🔄 Using hybrid translation service with caching');
      translatedText = await translationService.translateWithCache(
        text,
        targetLanguage,
        sourceLanguage,
        contentType,
        contentId
      );
    } else {
      // Direct Azure translation without caching (for one-off translations)
      console.log('🚀 Using direct Azure translation (no cache)');
      const azureTranslator = new AzureTranslatorService();
      const result = await azureTranslator.translateText(text, targetLanguage, sourceLanguage);
      translatedText = result[0]?.translations?.[0]?.text || text;
    }

    console.log('✅ Translation completed:', {
      originalLength: text.length,
      translatedLength: translatedText.length,
      cached: useCache,
      result: translatedText.substring(0, 50) + '...'
    });

    return NextResponse.json({
      success: true,
      translatedText,
      sourceLanguage,
      targetLanguage,
      cached: useCache,
      contentType,
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const translatorService = new AzureTranslatorService();
    const languages = await translatorService.getSupportedLanguages();
    return NextResponse.json({
      success: true,
      languages,
    });
  } catch (error) {
    console.error('Get languages API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supported languages' },
      { status: 500 }
    );
  }
}
