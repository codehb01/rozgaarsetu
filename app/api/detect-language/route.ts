import { NextRequest, NextResponse } from 'next/server';
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

    const translatorService = new AzureTranslatorService();
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const detectedLanguage = await translatorService.detectLanguage(text);

    return NextResponse.json({
      success: true,
      detectedLanguage,
    });
  } catch (error) {
    console.error('Language detection API error:', error);
    return NextResponse.json(
      { error: 'Language detection failed' },
      { status: 500 }
    );
  }
}