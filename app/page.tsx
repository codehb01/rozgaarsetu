'use client'
import { useEffect, useState } from "react";
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import StickyFooter from "@/components/sticky-footer";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ShapeHero from "@/components/kokonutui/shape-hero";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import ScrollText from "@/components/kokonutui/scroll-text";
import TypewriterTitle from "@/components/kokonutui/type-writer";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useLanguage();

  useEffect( () => {
    // Simple Lenis setup that works better with sticky elements
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Simulate loading states
    const featuresTimer = setTimeout(() => setIsFeaturesLoading(false), 2000);

    // Scroll to top button visibility
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy()
      clearTimeout(featuresTimer);
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section with ShapeHero */}
      <ShapeHero 
        title1={t('home.heroTitle')}
        title2={t('home.heroTitleBlue')}
        subtitle={t('home.heroDesc')}
      />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            {t('home.whyChoose')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('home.whyChooseDesc')}
          </p>
        </div>

        {isFeaturesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {t('home.features.instant.title')}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {t('home.features.instant.desc')}
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {t('home.features.verified.title')}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {t('home.features.verified.desc')}
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {t('home.features.secure.title')}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {t('home.features.secure.desc')}
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        )}
      </section>

      {/* Statistics Section with ScrollText */}
      <section className="py-20">
        <ScrollText
          texts={[t('home.activeWorkers'), t('home.jobsCompleted'), t('home.successRate')]}
          className="text-4xl font-bold"
        />
      </section>

      {/* How it works Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            {t('home.howItWorks.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">{t('home.howItWorks.step1.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.howItWorks.step1.desc')}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">{t('home.howItWorks.step2.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.howItWorks.step2.desc')}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">{t('home.howItWorks.step3.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('home.howItWorks.step3.desc')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <ShimmerText 
            text={t('home.cta.title')}
            className="text-5xl font-bold mb-6"
          />
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('home.cta.desc')}
          </p>
          
          <MainMenusGradientCard 
            title={t('home.getStarted')}
            description={t('home.learnMore')}
            className="mx-auto max-w-sm"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">{t('home.getStarted')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('home.learnMore')}</p>
            </div>
          </MainMenusGradientCard>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors"
        >
          ↑
        </motion.button>
      )}

      <StickyFooter />
    </div>
  );
}