'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardSection } from '@/components/ui/card';

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export function AzureTranslator() {
  const { translateText, detectLanguage, isTranslating } = useLanguage();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [detectedLang, setDetectedLang] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    try {
      const translated = await translateText(sourceText, targetLanguage as any);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed. Please try again.');
    }
  };

  const handleDetectLanguage = async () => {
    if (!sourceText.trim()) return;

    try {
      const detected = await detectLanguage(sourceText);
      setDetectedLang(detected);
    } catch (error) {
      console.error('Language detection failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader 
          title="Azure Translator" 
          subtitle="Real-time text translation powered by Azure AI"
        />
        <CardSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Text */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Source Text</label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDetectLanguage}
                    disabled={!sourceText.trim() || isTranslating}
                    variant="outline"
                    size="sm"
                  >
                    Detect Language
                  </Button>
                  {detectedLang && (
                    <span className="text-xs text-gray-500 self-center">
                      Detected: {LANGUAGE_OPTIONS.find(l => l.code === detectedLang)?.name || detectedLang}
                    </span>
                  )}
                </div>
              </div>
              <Textarea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            {/* Target Translation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Translation</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Target language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                className="min-h-[200px] resize-none bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="px-8"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </CardSection>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader 
          title="Quick Examples" 
          subtitle="Try these sample texts"
        />
        <CardSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { text: "Hello, how are you?", lang: "English" },
              { text: "I am looking for a plumber.", lang: "English" },
              { text: "What is your hourly rate?", lang: "English" },
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                onClick={() => setSourceText(example.text)}
              >
                <div>
                  <div className="font-medium">{example.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{example.lang}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardSection>
      </Card>
    </div>
  );
}