'use client';

import { AzureTranslator } from '@/components/azure-translator';
import { useLanguage } from '@/contexts/language-context';

export default function TranslatorDemoPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            Azure AI Translator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience real-time translation powered by Microsoft Azure Cognitive Services
          </p>
        </div>

        <AzureTranslator />

        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              🚀 Features
            </h3>
            <ul className="text-blue-800 dark:text-blue-300 space-y-2">
              <li>✅ Real-time text translation</li>
              <li>✅ Automatic language detection</li>
              <li>✅ Support for 100+ languages</li>
              <li>✅ Powered by Azure AI</li>
              <li>✅ Integrated with RozgaarSetu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}