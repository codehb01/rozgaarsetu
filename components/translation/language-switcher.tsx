'use client';

import React from 'react';
import { useTranslation, Language } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr' as Language, name: 'मराठी', flag: '🇮🇳' },
];

interface LanguageSwitcherProps {
  variant?: 'select' | 'buttons';
  className?: string;
  showFlags?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'select',
  className = '',
  showFlags = true,
}) => {
  const { currentLanguage, setLanguage, isLoading } = useTranslation();

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            disabled={isLoading}
            className="min-w-0"
          >
            {showFlags && <span className="mr-1">{lang.flag}</span>}
            <span className="text-xs">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select
      value={currentLanguage}
      onValueChange={(value: Language) => setLanguage(value)}
      disabled={isLoading}
    >
      <SelectTrigger className={`w-40 ${className}`}>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              {showFlags && <span>{lang.flag}</span>}
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;