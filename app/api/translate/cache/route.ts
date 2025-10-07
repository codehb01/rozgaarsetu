import { NextRequest, NextResponse } from 'next/server';
import { getTranslationService } from '@/lib/translation-service';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('daysOld') || '30');

    if (daysOld < 1 || daysOld > 365) {
      return NextResponse.json(
        { error: 'daysOld must be between 1 and 365' },
        { status: 400 }
      );
    }

    const translationService = getTranslationService();
    const deletedCount = await translationService.clearOldCache(daysOld);

    return NextResponse.json({
      success: true,
      data: {
        deletedCount,
        message: `Cleared ${deletedCount} cache entries older than ${daysOld} days`
      }
    });

  } catch (error) {
    console.error('Cache cleanup error:', error);
    return NextResponse.json(
      { 
        error: 'Cache cleanup failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}