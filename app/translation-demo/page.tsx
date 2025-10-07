'use client';

import React, { useState, useEffect } from 'react';
import { TranslatedText, AutoTranslate, useTextTranslation } from '@/components/translation/auto-translate';
import { AutoTranslateData, AutoTranslateList } from '@/components/translation/auto-translate-data';
import { OptimizedTranslatedText } from '@/components/translation/optimized-translate';
import LanguageSwitcher from '@/components/translation/language-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

// Sample data that would come from API
const sampleWorkers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    skills: ['Plumbing', 'Electrical Work', 'Home Repair'],
    bio: 'Experienced plumber with 10 years of expertise in residential and commercial plumbing.',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    reviews: [
      'Excellent work! Very professional and quick.',
      'Fixed my kitchen sink perfectly. Highly recommended.',
      'Great service and fair pricing.'
    ]
  },
  {
    id: 2,
    name: 'Priya Sharma',
    skills: ['House Cleaning', 'Cooking', 'Childcare'],
    bio: 'Reliable house help with excellent cooking skills and childcare experience.',
    location: 'Delhi, India',
    rating: 4.9,
    reviews: [
      'Very trustworthy and hardworking.',
      'Amazing cook! Kids love her food.',
      'Always punctual and thorough in cleaning.'
    ]
  }
];

const staticTexts = {
  title: 'Translation System Demo',
  subtitle: 'Test the automatic translation features',
  workerListTitle: 'Available Workers',
  testTranslationTitle: 'Test Manual Translation',
  placeholderText: 'Enter text to translate...',
  translateButton: 'Translate',
  skillsLabel: 'Skills:',
  locationLabel: 'Location:',
  ratingLabel: 'Rating:',
  reviewsLabel: 'Reviews:',
  bioLabel: 'Bio:'
};

export default function TranslationDemo() {
  const [customText, setCustomText] = useState('');
  const { currentLanguage, translate } = useTranslation();
  const [translatedCustomText, setTranslatedCustomText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Auto-translate when language changes
  useEffect(() => {
    if (customText.trim() && currentLanguage !== 'en') {
      handleAutoTranslation();
    } else if (currentLanguage === 'en') {
      setTranslatedCustomText('');
    }
  }, [currentLanguage, customText]);

  const handleAutoTranslation = async () => {
    if (!customText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translate(customText, 'demo');
      setTranslatedCustomText(result);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedCustomText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCustomTranslation = async () => {
    handleAutoTranslation();
  };

  const WorkerCard = ({ worker }: { worker: typeof sampleWorkers[0] }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{worker.name}</span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TranslatedText context="demo-labels">{staticTexts.ratingLabel}</TranslatedText>
            <span>{worker.rating}/5</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="font-medium">
              <TranslatedText context="demo-labels">{staticTexts.locationLabel}</TranslatedText>
            </span>
            <span className="ml-2">{worker.location}</span>
          </div>
          
          <div>
            <span className="font-medium">
              <TranslatedText context="demo-labels">{staticTexts.skillsLabel}</TranslatedText>
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {worker.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  <TranslatedText context="skills">{skill}</TranslatedText>
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-medium">
              <TranslatedText context="demo-labels">{staticTexts.bioLabel}</TranslatedText>
            </span>
            <p className="mt-1 text-gray-700">
              <TranslatedText context="worker-bio">{worker.bio}</TranslatedText>
            </p>
          </div>

          <div>
            <span className="font-medium">
              <TranslatedText context="demo-labels">{staticTexts.reviewsLabel}</TranslatedText>
            </span>
            <div className="mt-2 space-y-2">
              {worker.reviews.map((review, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <TranslatedText context="reviews">{review}</TranslatedText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <OptimizedTranslatedText context="demo-title">{staticTexts.title}</OptimizedTranslatedText>
          </h1>
          <p className="text-gray-600">
            <OptimizedTranslatedText context="demo-subtitle">{staticTexts.subtitle}</OptimizedTranslatedText>
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Current Language: {currentLanguage.toUpperCase()}
          </p>
        </div>
        <LanguageSwitcher variant="select" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Worker List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText context="demo-section">{staticTexts.workerListTitle}</TranslatedText>
          </h2>
          
          {/* Auto-translate entire data structure */}
          <AutoTranslateData data={sampleWorkers} context="workers">
            {(translatedWorkers, isLoading) => (
              <div>
                {isLoading && (
                  <div className="text-blue-600 mb-4">Translating content...</div>
                )}
                {translatedWorkers.map((worker: any) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            )}
          </AutoTranslateData>
        </div>

        {/* Right Column - Manual Translation Test */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <TranslatedText context="demo-section">{staticTexts.testTranslationTitle}</TranslatedText>
          </h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText context="demo-labels">Enter text in English:</TranslatedText>
                  </label>
                  <Input
                    placeholder="Type your English text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="mb-3"
                  />
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <TranslatedText context="demo-help">💡 Text will automatically translate when you change the language above!</TranslatedText>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCustomTranslation}
                      disabled={isTranslating || !customText.trim()}
                      className="flex-1"
                      variant="outline"
                    >
                      {isTranslating ? 'Translating...' : (
                        <TranslatedText context="demo-button">Translate Now</TranslatedText>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => setCustomText('Welcome to our platform! Find skilled workers in your area.')}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      <TranslatedText context="demo-button">Sample Text</TranslatedText>
                    </Button>
                  </div>
                </div>

                {/* Show translation result */}
                {customText && (
                  <div className="mt-4 space-y-3">
                    {/* Original Text */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        <TranslatedText context="demo-labels">Original (English):</TranslatedText>
                      </p>
                      <p className="font-medium text-blue-900">{customText}</p>
                    </div>

                    {/* Translated Text */}
                    {currentLanguage !== 'en' && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          <TranslatedText context="demo-labels">
                            {`Translated (${currentLanguage === 'hi' ? 'Hindi' : 'Marathi'}):`}
                          </TranslatedText>
                        </p>
                        {isTranslating ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            <span className="text-green-600">Translating...</span>
                          </div>
                        ) : (
                          <p className="font-medium text-green-900">
                            {translatedCustomText || 'Switch language to see translation'}
                          </p>
                        )}
                      </div>
                    )}

                    {currentLanguage === 'en' && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <TranslatedText context="demo-labels">Switch to Hindi or Marathi to see translation</TranslatedText>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Examples of different translation approaches */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-medium text-gray-800">Translation Examples:</h3>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Simple Text Translation:</p>
                    <p><TranslatedText context="example">Welcome to our platform!</TranslatedText></p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Auto Translate with Loading:</p>
                    <AutoTranslate 
                      text="This text is automatically translated with loading state."
                      context="example"
                      render={(text, isLoading) => (
                        <p className={isLoading ? 'opacity-50' : ''}>
                          {isLoading ? 'Translating...' : text}
                        </p>
                      )}
                    />
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Technical Text (won't translate):</p>
                    <p>https://example.com | user@email.com | UUID: 123e4567-e89b-12d3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">System Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✅ Intelligent caching - translations are stored in database</li>
          <li>✅ Automatic content detection - skips URLs, emails, UUIDs</li>
          <li>✅ Batch translation support for performance</li>
          <li>✅ Context-aware translations for better accuracy</li>
          <li>✅ Client-side caching for instant UI updates</li>
          <li>✅ Fallback to original text on translation errors</li>
        </ul>
      </div>
    </div>
  );
}