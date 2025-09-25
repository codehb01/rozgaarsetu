import { NextRequest, NextResponse } from 'next/server';
import { GoogleOnlyTranslationService } from '@/lib/google-only-translation-service';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en', contentType = 'other', contentId } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Google translation request: "${text.substring(0, 50)}..." (${sourceLanguage} -> ${targetLanguage})`);

    // Create service instance
    const translationService = new GoogleOnlyTranslationService();

    // Get translation
    const translatedText = await translationService.translateWithCache(
      text,
      targetLanguage,
      sourceLanguage,
      contentType,
      contentId
    );

    return NextResponse.json({
      success: true,
      translatedText,
      provider: 'google',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Google translation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}