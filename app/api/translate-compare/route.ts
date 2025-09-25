import { NextRequest, NextResponse } from 'next/server';
import { EnhancedTranslationService } from '@/lib/enhanced-translation-service';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en', contentType = 'other', contentId, googleApiKey } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // Use provided key or environment variable
    const apiKey = googleApiKey || process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key is required for comparison (either in request or environment)' },
        { status: 400 }
      );
    }

    console.log(`🚀 Translation comparison request: "${text.substring(0, 50)}..." (${sourceLanguage} -> ${targetLanguage})`);

    // Create service instance with Google API key
    const translationService = new EnhancedTranslationService(apiKey);

    // Compare translation performance
    const comparison = await translationService.compareTranslationPerformance(
      text,
      targetLanguage,
      sourceLanguage,
      contentType,
      contentId
    );

    return NextResponse.json({
      success: true,
      comparison,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation comparison error:', error);
    
    return NextResponse.json(
      { 
        error: 'Translation comparison failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}