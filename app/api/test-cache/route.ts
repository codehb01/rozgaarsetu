import { NextRequest, NextResponse } from 'next/server';
import { translationService } from '@/lib/translation-service';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'test-cache') {
      console.log('🧪 Testing cache functionality...');
      
      // Test data
      const testText = 'Hello, this is a test message for caching!';
      const targetLanguage = 'hi';
      
      // First translation (should be cache miss)
      console.log('📝 First translation (should be cache MISS)...');
      const start1 = Date.now();
      const result1 = await translationService.translateWithCache(
        testText,
        targetLanguage,
        'en',
        'other',
        'test-cache-1'
      );
      const time1 = Date.now() - start1;
      
      // Second translation (should be cache hit)
      console.log('🔄 Second translation (should be cache HIT)...');
      const start2 = Date.now();
      const result2 = await translationService.translateWithCache(
        testText,
        targetLanguage,
        'en',
        'other',
        'test-cache-2'
      );
      const time2 = Date.now() - start2;
      
      // Get cache stats
      const stats = await translationService.getCacheStats();
      
      return NextResponse.json({
        success: true,
        testResults: {
          firstTranslation: {
            text: result1,
            time: `${time1}ms`,
            expected: 'CACHE MISS (slower)'
          },
          secondTranslation: {
            text: result2,
            time: `${time2}ms`,
            expected: 'CACHE HIT (faster)'
          },
          speedImprovement: `${Math.round((time1 - time2) / time1 * 100)}%`,
          cachingWorking: time2 < time1
        },
        cacheStats: stats
      });
      
    } else if (action === 'clear-test-cache') {
      // Clear test cache entries
      const deleted = await prisma.translationCache.deleteMany({
        where: {
          contentId: {
            startsWith: 'test-cache'
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${deleted.count} test cache entries`
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action. Use "test-cache" or "clear-test-cache"'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Cache test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await translationService.getCacheStats();
    return NextResponse.json({
      success: true,
      cacheStats: stats,
      instructions: {
        testCache: 'POST with {"action": "test-cache"}',
        clearTestCache: 'POST with {"action": "clear-test-cache"}'
      }
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}