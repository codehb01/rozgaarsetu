#!/usr/bin/env node

/**
 * Translation API Test Script
 * 
 * This script tests the translation system APIs to ensure they work correctly.
 * Run with: node test-translation.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testSingleTranslation() {
  console.log('🧪 Testing single translation...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Welcome to our platform',
        targetLanguage: 'hi',
        sourceLanguage: 'en',
        context: 'greeting'
      })
    });

    const result = await response.json();
    console.log('✅ Single translation:', result);
    
    if (result.success && result.data.translatedText) {
      console.log(`   Original: "Welcome to our platform"`);
      console.log(`   Hindi: "${result.data.translatedText}"`);
      console.log(`   Cached: ${result.data.cached}`);
    }
  } catch (error) {
    console.error('❌ Single translation failed:', error.message);
  }
}

async function testBatchTranslation() {
  console.log('\n🧪 Testing batch translation...');
  
  try {
    const texts = [
      'Find Skilled Workers',
      'Connect with verified professionals',
      'Search for services',
      'Book Now'
    ];

    const response = await fetch(`${BASE_URL}/api/translate/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage: 'mr',
        sourceLanguage: 'en',
        context: 'ui-labels'
      })
    });

    const result = await response.json();
    console.log('✅ Batch translation:', result);
    
    if (result.success && result.data.translations) {
      console.log('   Translations:');
      result.data.translations.forEach((translation, index) => {
        console.log(`   "${texts[index]}" -> "${translation.translatedText}"`);
      });
      console.log(`   Total: ${result.data.count}, Cached: ${result.data.cached}`);
    }
  } catch (error) {
    console.error('❌ Batch translation failed:', error.message);
  }
}

async function testSupportedLanguages() {
  console.log('\n🧪 Testing supported languages...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/translate`);
    const result = await response.json();
    console.log('✅ Supported languages:', result);
    
    if (result.success && result.data.supportedLanguages) {
      console.log('   Available languages:');
      result.data.supportedLanguages.forEach(lang => {
        console.log(`   ${lang.code}: ${lang.name}`);
      });
    }
  } catch (error) {
    console.error('❌ Supported languages test failed:', error.message);
  }
}

async function testWorkersAPIWithTranslation() {
  console.log('\n🧪 Testing workers API with translation...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/workers?limit=2`, {
      headers: {
        'x-translate-to': 'hi'
      }
    });

    const result = await response.json();
    console.log('✅ Workers API with translation:', {
      count: result.count,
      translated: result.translated,
      targetLanguage: result.targetLanguage,
      firstWorker: result.workers?.[0] ? {
        name: result.workers[0].name,
        bio: result.workers[0].workerProfile?.bio?.substring(0, 50) + '...'
      } : null
    });
  } catch (error) {
    console.error('❌ Workers API translation test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Translation System Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  await testSingleTranslation();
  await testBatchTranslation();
  await testSupportedLanguages();
  await testWorkersAPIWithTranslation();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Translation tests completed!');
  console.log('\n💡 To test the UI:');
  console.log('   1. Visit http://localhost:3000/translation-demo');
  console.log('   2. Switch languages using the language switcher');
  console.log('   3. Watch content translate automatically');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testSingleTranslation,
  testBatchTranslation,
  testSupportedLanguages,
  testWorkersAPIWithTranslation,
  runTests
};