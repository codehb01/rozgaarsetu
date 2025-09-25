import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { translationService } from '@/lib/translation-service';

export async function GET() {
  try {
    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Test translation cache table
    const cacheCount = await prisma.translationCache.count();
    
    // Get cache stats
    const stats = await translationService.getCacheStats();
    
    return NextResponse.json({
      success: true,
      database: {
        connected: !!dbTest,
        cacheTableExists: true,
        totalCacheEntries: cacheCount
      },
      cacheStats: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}