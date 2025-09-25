import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface TranslationResult {
  text: string;
  to: string;
}

export interface TranslationResponse {
  translations: TranslationResult[];
}

export class AzureTranslatorService {
  private subscriptionKey: string;
  private endpoint: string;
  private region: string;

  constructor() {
    this.subscriptionKey = process.env.AZURE_TRANSLATOR_KEY || '';
    this.endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
    this.region = process.env.AZURE_TRANSLATOR_REGION || 'centralindia';

    console.log('Azure Translator Config:', {
      hasKey: !!this.subscriptionKey,
      endpoint: this.endpoint,
      region: this.region
    });

    if (!this.subscriptionKey) {
      console.error('AZURE_TRANSLATOR_KEY is missing from environment variables');
      throw new Error('Azure Translator subscription key is required');
    }
  }

  async translateText(
    text: string | string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResponse[]> {
    try {
      const textsToTranslate = Array.isArray(text) ? text : [text];
      const body = textsToTranslate.map(t => ({ text: t }));

      const response = await axios.post(
        `${this.endpoint}/translate`,
        body,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Ocp-Apim-Subscription-Region': this.region,
            'Content-Type': 'application/json',
            'X-ClientTraceId': uuidv4(),
          },
          params: {
            'api-version': '3.0',
            from: sourceLanguage,
            to: targetLanguage,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Azure Translator error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.endpoint}/detect`,
        [{ text }],
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Ocp-Apim-Subscription-Region': this.region,
            'Content-Type': 'application/json',
            'X-ClientTraceId': uuidv4(),
          },
          params: {
            'api-version': '3.0',
          },
        }
      );

      return response.data[0]?.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  async getSupportedLanguages(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.endpoint}/languages`,
        {
          params: {
            'api-version': '3.0',
            scope: 'translation',
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