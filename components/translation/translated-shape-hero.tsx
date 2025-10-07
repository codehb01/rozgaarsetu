'use client';

import React, { useState, useEffect } from 'react';
import ShapeHero from '@/components/kokonutui/shape-hero';
import { useTranslation } from '@/hooks/use-translation';
import { useBatchTranslation } from '@/hooks/use-batch-translation';

interface TranslatedShapeHeroProps {
  title1: string;
  title2: string;
  subtitle: string;
}

export const TranslatedShapeHero: React.FC<TranslatedShapeHeroProps> = ({
  title1,
  title2,
  subtitle
}) => {
  const { translateSync, currentLanguage } = useTranslation();
  const { requestTranslation } = useBatchTranslation();
  
  const [translatedTitle1, setTranslatedTitle1] = useState(title1);
  const [translatedTitle2, setTranslatedTitle2] = useState(title2);
  const [translatedSubtitle, setTranslatedSubtitle] = useState(subtitle);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedTitle1(title1);
      setTranslatedTitle2(title2);
      setTranslatedSubtitle(subtitle);
      return;
    }

    // Try sync translation first (from cache)
    const syncTitle1 = translateSync(title1, 'homepage');
    const syncTitle2 = translateSync(title2, 'homepage');
    const syncSubtitle = translateSync(subtitle, 'homepage');

    // If cached, use immediately
    if (syncTitle1 !== title1) setTranslatedTitle1(syncTitle1);
    if (syncTitle2 !== title2) setTranslatedTitle2(syncTitle2);
    if (syncSubtitle !== subtitle) setTranslatedSubtitle(syncSubtitle);

    // If not cached, request batch translation
    if (syncTitle1 === title1) {
      requestTranslation(title1, 'homepage').then(setTranslatedTitle1);
    }
    if (syncTitle2 === title2) {
      requestTranslation(title2, 'homepage').then(setTranslatedTitle2);
    }
    if (syncSubtitle === subtitle) {
      requestTranslation(subtitle, 'homepage').then(setTranslatedSubtitle);
    }
  }, [currentLanguage, title1, title2, subtitle, translateSync, requestTranslation]);

  return (
    <ShapeHero
      title1={translatedTitle1}
      title2={translatedTitle2}
      subtitle={translatedSubtitle}
    />
  );
};