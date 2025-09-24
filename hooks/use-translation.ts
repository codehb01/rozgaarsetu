import { useLanguage, type Language } from '@/contexts/language-context';

type TranslationKey = 
  | 'welcome'
  | 'getStarted'
  | 'learnMore'
  | 'signIn'
  | 'signUp'
  | 'chooseLanguage'
  | 'selectLanguage'
  | 'continueWith'
  | 'changeLater'
  | 'useDefault';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    welcome: 'Connect. Work. Grow.',
    getStarted: 'Get Started Today',
    learnMore: 'Learn More',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    chooseLanguage: 'Choose your language',
    selectLanguage: 'Select your preferred language to continue',
    continueWith: 'Continue with',
    changeLater: 'You can change this later in settings',
    useDefault: 'Use Default'
  },
  hi: {
    welcome: 'जुड़ें। काम करें। बढ़ें।',
    getStarted: 'आज ही शुरू करें',
    learnMore: 'और जानें',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    chooseLanguage: 'अपनी भाषा चुनें',
    selectLanguage: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
    continueWith: 'के साथ जारी रखें',
    changeLater: 'आप इसे बाद में सेटिंग्स में बदल सकते हैं',
    useDefault: 'डिफ़ॉल्ट उपयोग करें'
  },
  mr: {
    welcome: 'जोडणी. काम. वाढ.',
    getStarted: 'आज सुरुवात करा',
    learnMore: 'अधिक जाणा',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    chooseLanguage: 'तुमची भाषा निवडा',
    selectLanguage: 'सुरू ठेवण्यासाठी तुमची आवडती भाषा निवडा',
    continueWith: 'सह सुरू ठेवा',
    changeLater: 'तुम्ही हे नंतर सेटिंग्जमध्ये बदलू शकता',
    useDefault: 'डिफॉल्ट वापरा'
  }
};

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key];
  };
  
  return { t, language };
}