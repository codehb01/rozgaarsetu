import { NextRequest, NextResponse } from 'next/server';
import { getTranslationService } from '@/lib/translation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, targetLanguage, sourceLanguage, context } = body;

    // Validate required fields
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid texts array' },
        { status: 400 }
      );
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required field: targetLanguage' },
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

    // Limit batch size to prevent abuse
    if (texts.length > 100) {
      return NextResponse.json(
        { error: 'Batch size too large. Maximum 100 texts allowed.' },
        { status: 400 }
      );
    }

    // Perform batch translation
    const translationService = getTranslationService();
    const results = await translationService.translateBatch(
      texts,
      targetLanguage,
      sourceLanguage || 'en',
      context
    );

    return NextResponse.json({
      success: true,
      data: {
        translations: results,
        count: results.length,
        cached: results.filter(r => r.cached).length
      }
    });

  } catch (error) {
    console.error('Batch translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Batch translation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}