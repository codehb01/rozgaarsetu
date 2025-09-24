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
import LanguageShowcaseText from '@/components/language-showcase-text';

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

interface LanguageSelectionDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LanguageSelectionDrawer({ 
  isOpen: externalIsOpen, 
  onClose: externalOnClose 
}: LanguageSelectionDrawerProps = {}) {
  const { language, setLanguage, isFirstVisit, markVisited } = useLanguage();
  const { t } = useTranslation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined 
    ? (open: boolean) => !open && externalOnClose() 
    : setInternalIsOpen;

  useEffect(() => {
    // Show drawer only on first visit and when not externally controlled
    if (isFirstVisit && externalIsOpen === undefined) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, externalIsOpen]);

  // Development keyboard shortcut - Ctrl+L to open language drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        if (externalIsOpen === undefined) {
          setInternalIsOpen(true);
        }
        console.log('🌍 Language drawer opened via keyboard shortcut (Ctrl+L)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [externalIsOpen]);

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
      <DrawerContent className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-950 border-0">
        <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <DrawerHeader className="text-center pb-1 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 group touch-manipulation"
              aria-label="Close language selection"
            >
              <svg 
                className="w-3 h-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Compact header */}
            <div className="mx-auto mb-2">
              {/* Compact icon */}
              <div className="mx-auto mb-2 w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-lg">🌐</span>
              </div>
              
              {/* Compact dynamic greeting showcase */}
              <div className="mb-2">
                <div className="min-h-[40px] flex items-center justify-center">
                  <LanguageShowcaseText />
                </div>
              </div>
            </div>
            
            <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-1 tracking-tight">
              Choose Your Language
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-relaxed">
              Select your preferred language
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    w-full p-3 rounded-lg transition-all duration-300 touch-manipulation group
                    ${language === lang.code 
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }
                    active:scale-[0.98] transform min-h-[50px]
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg transform group-hover:scale-110 transition-transform duration-200">
                      {lang.flag}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm tracking-tight">
                        {lang.name}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                        {lang.nativeName}
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 text-center space-y-2">
              <button
                onClick={handleSkip}
                className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all duration-200 rounded-lg touch-manipulation min-h-[40px] group"
              >
                <span className="group-hover:scale-105 transform transition-transform duration-200 inline-block">
                  Continue with English
                </span>
              </button>
              <div className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                You can change this anytime in settings
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}