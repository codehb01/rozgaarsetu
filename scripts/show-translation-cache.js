import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showTranslationCache() {
  try {
    console.log('🔍 Translation Cache Table Structure:');
    console.log('=====================================');
    
    const cacheEntries = await prisma.translationCache.findMany({
      take: 10, // Show first 10 entries
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total Cache Entries: ${cacheEntries.length}`);
    console.log('');

    cacheEntries.forEach((entry, index) => {
      console.log(`--- Entry ${index + 1} ---`);
      console.log(`ID: ${entry.id}`);
      console.log(`Original Text: "${entry.originalText.substring(0, 50)}${entry.originalText.length > 50 ? '...' : ''}"`);
      console.log(`Translated Text: "${entry.translatedText.substring(0, 50)}${entry.translatedText.length > 50 ? '...' : ''}"`);
      console.log(`Language: ${entry.sourceLanguage} → ${entry.targetLanguage}`);
      console.log(`Content Type: ${entry.contentType}`);
      console.log(`Content ID: ${entry.contentId || 'N/A'}`);
      console.log(`Hash Key: ${entry.hashKey.substring(0, 16)}...`);
      console.log(`Created: ${entry.createdAt.toISOString()}`);
      console.log(`Last Accessed: ${entry.lastAccessedAt.toISOString()}`);
      console.log('');
    });

    // Show statistics
    const stats = await prisma.translationCache.groupBy({
      by: ['contentType'],
      _count: {
        id: true
      }
    });

    console.log('📈 Cache Statistics by Content Type:');
    stats.forEach(stat => {
      console.log(`${stat.contentType}: ${stat._count.id} entries`);
    });

    const langStats = await prisma.translationCache.groupBy({
      by: ['sourceLanguage', 'targetLanguage'],
      _count: {
        id: true
      }
    });

    console.log('');
    console.log('🌐 Cache Statistics by Language Pair:');
    langStats.forEach(stat => {
      console.log(`${stat.sourceLanguage} → ${stat.targetLanguage}: ${stat._count.id} entries`);
    });

  } catch (error) {
    console.error('❌ Error querying translation cache:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showTranslationCache();