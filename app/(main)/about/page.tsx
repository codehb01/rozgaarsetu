'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card, CardHeader, CardSection } from '@/components/ui/card';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
          {t('about.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader title={t('about.missionTitle')} subtitle={t('about.missionSubtitle')} />
          <CardSection>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.missionDesc')}
            </p>
          </CardSection>
        </Card>

        <Card>
          <CardHeader title={t('about.visionTitle')} subtitle={t('about.visionSubtitle')} />
          <CardSection>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.visionDesc')}
            </p>
          </CardSection>
        </Card>
      </div>

      <div className="mb-16">
        <Card>
          <CardHeader title={t('about.howItWorksTitle')} subtitle={t('about.howItWorksSubtitle')} />
          <CardSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('about.step1Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.step1Desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('about.step2Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.step2Desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('about.step3Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('about.step3Desc')}
                </p>
              </div>
            </div>
          </CardSection>
        </Card>
      </div>

      <div className="text-center">
        <Card>
          <CardHeader title={t('about.joinTitle')} subtitle={t('about.joinSubtitle')} />
          <CardSection>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('about.joinDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sign-up"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {t('about.findWorkers')}
              </a>
              <a
                href="/worker"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {t('about.becomeWorker')}
              </a>
            </div>
          </CardSection>
        </Card>
      </div>
    </div>
  );
}