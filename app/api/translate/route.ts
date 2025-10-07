import { NextRequest, NextResponse } from 'next/server';
import { getTranslationService } from '@/lib/translation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage, sourceLanguage, context } = body;

    // Validate required fields
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text and targetLanguage' },
        { status: 400 }
      );
    }

    // Validate language codes
    const supportedLanguages = ['en', 'hi', 'mr'];
    if (!supportedLanguages.includes(targetLanguage)) {
      return NextResponse.json(
        { error: 'Unsupported target language' },
        { status: 400 }
      );
    }

    if (sourceLanguage && !supportedLanguages.includes(sourceLanguage)) {
      return NextResponse.json(
        { error: 'Unsupported source language' },
        { status: 400 }
      );
    }

    // Perform translation
    const translationService = getTranslationService();
    const result = await translationService.translate({
      text,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'en',
      context
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Translation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const translationService = getTranslationService();
    const supportedLanguages = await translationService.getSupportedLanguages();
    
    return NextResponse.json({
      success: true,
      data: { supportedLanguages }
    });
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supported languages' },
      { status: 500 }
    );
  }
}