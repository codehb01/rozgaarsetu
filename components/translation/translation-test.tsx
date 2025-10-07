'use client';

import React from 'react';
import { TranslatedText } from '@/components/translation/auto-translate';
import { LanguageSwitcher } from '@/components/translation/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export function TranslationTest() {
  const { currentLanguage, isLoading } = useTranslation();

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <div className="text-sm font-semibold mb-2">Translation Test</div>
      <div className="text-xs mb-2">Language: {currentLanguage}</div>
      <div className="text-xs mb-2">Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div className="text-xs mb-2">
        Test: <TranslatedText context="homepage">Connect. Work.</TranslatedText>
      </div>
      <div className="text-xs mb-2">
        Test: <TranslatedText context="homepage">Grow.</TranslatedText>
      </div>
      <LanguageSwitcher variant="select" />
    </div>
  );
}