'use client';

import { useLanguage } from "@/lib/language-context";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">RozgaarSetu</h3>
            <p className="text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.findJobs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.postJobs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.howItWorks')}
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.about')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.careers')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
