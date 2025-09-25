import axios from 'axios';

export interface GoogleTranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface GoogleTranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

export class GoogleTranslatorService {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY || '';
    this.endpoint = 'https://translation.googleapis.com/language/translate/v2';

    console.log('Google Translator Config:', {
      hasKey: !!this.apiKey,
      endpoint: this.endpoint
    });

    if (!this.apiKey) {
      console.error('Google Translate API key is missing');
      throw new Error('Google Translate API key is required');
    }
  }

  async translateText(
    text: string | string[],
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<GoogleTranslationResult[]> {
    try {
      const textsToTranslate = Array.isArray(text) ? text : [text];

      // Use URL-encoded form data for Google Translate API
      const params = new URLSearchParams();
      params.append('key', this.apiKey);
      params.append('target', targetLanguage);
      
      if (sourceLanguage) {
        params.append('source', sourceLanguage);
      }
      
      textsToTranslate.forEach(t => {
        params.append('q', t);
      });
      
      params.append('format', 'text');

      const response = await axios.post(
        this.endpoint,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const translations = response.data.data.translations.map((translation: any) => ({
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      }));

      return translations;
    } catch (error) {
      console.error('Google Translator error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('key', this.apiKey);
      params.append('q', text);

      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2/detect',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.data.detections[0][0].language || 'en';
    } catch (error) {
      console.error('Google language detection error:', error);
      return 'en'; // Default to English
    }
  }

  async getSupportedLanguages(): Promise<any> {
    try {
      const response = await axios.get(
        'https://translation.googleapis.com/language/translate/v2/languages',
        {
          params: {
            key: this.apiKey,
            target: 'en'
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Get languages error:', error);
      throw new Error('Failed to fetch supported languages');
    }
  }
}