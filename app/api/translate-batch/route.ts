import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/lib/translation-service';

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
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    console.log(`🔄 Batch translation request for ${items.length} items`);

    const translations = await translationService.translateBatch(items);

    console.log('✅ Batch translation completed');

    return NextResponse.json({
      success: true,
      translations,
      itemCount: items.length,
    });

  } catch (error) {
    console.error('Batch translation API error:', error);
    return NextResponse.json(
      { 
        error: 'Batch translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await translationService.getCacheStats();
    return NextResponse.json({
      success: true,
      message: 'Batch Translation API is running',
      cacheStats: stats,
      usage: {
        endpoint: '/api/translate-batch',
        method: 'POST',
        body: {
          items: [
            {
              text: 'Text to translate',
              targetLanguage: 'hi',
              sourceLanguage: 'en',
              contentType: 'review|job|bio|description|title|other',
              contentId: 'optional-content-id'
            }
          ]
        }
      }
    });
  } catch (error) {
    console.error('Get batch translation info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch translation info' },
      { status: 500 }
    );
  }
}