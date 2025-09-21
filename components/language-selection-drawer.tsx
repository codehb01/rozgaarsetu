"use client";

import { useState, useEffect } from 'react';
import { useLanguage, type Language } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', nativeName: 'Hindi', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', nativeName: 'Marathi', flag: '🇮🇳' },
];

// Default language if user skips selection
const DEFAULT_LANGUAGE: Language = 'en';

export function LanguageSelectionDrawer() {
  const { language, setLanguage, isFirstVisit, markVisited } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show drawer only on first visit
    if (isFirstVisit) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const handleLanguageSelect = (selectedLang: Language) => {
    setLanguage(selectedLang);
    markVisited();
    setIsOpen(false);
  };

  const handleClose = () => {
    // If user closes without selecting, set default language and mark as visited
    setLanguage(DEFAULT_LANGUAGE);
    markVisited();
    setIsOpen(false);
  };

  const handleSkip = () => {
    // Explicitly skip with default language
    setLanguage(DEFAULT_LANGUAGE);
    markVisited();
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <DrawerHeader className="text-center pb-4 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group touch-manipulation"
              aria-label="Close language selection"
            >
              <svg 
                className="w-4 h-4 text-gray-500 group-hover:text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl sm:text-2xl">🌐</span>
            </div>
            <DrawerTitle className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {t('chooseLanguage')}
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 text-sm sm:text-base">
              {t('selectLanguage')}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <div className="space-y-2 sm:space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    w-full p-3 sm:p-4 md:p-5 rounded-xl border-2 transition-all duration-200 touch-manipulation
                    ${language === lang.code 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
                    active:scale-95 transform min-h-[60px] sm:min-h-[68px]
                  `}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-xl sm:text-2xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-base sm:text-lg">
                        {lang.name}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {lang.nativeName}
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
              <button
                onClick={handleSkip}
                className="w-full py-2 sm:py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-sm sm:text-base font-medium transition-colors duration-200 rounded-lg touch-manipulation min-h-[44px]"
              >
                {t('useDefault')} ({languages.find(l => l.code === DEFAULT_LANGUAGE)?.name})
              </button>
              <div className="text-xs sm:text-sm text-gray-400">
                {t('changeLater')}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}