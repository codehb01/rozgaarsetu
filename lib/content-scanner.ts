import { getTranslationService } from './translation-service';

export interface ScannedContent {
  text: string;
  context: string;
  element?: string;
  path?: string;
}

export class ContentScanner {
  private static instance: ContentScanner;
  private textCache = new Map<string, ScannedContent[]>();

  static getInstance(): ContentScanner {
    if (!ContentScanner.instance) {
      ContentScanner.instance = new ContentScanner();
    }
    return ContentScanner.instance;
  }

  /**
   * Extract text content from React component props
   */
  extractFromProps(props: any, context: string = 'component'): ScannedContent[] {
    const texts: ScannedContent[] = [];
    
    const extractTextRecursively = (obj: any, path: string = '') => {
      if (typeof obj === 'string' && obj.trim().length > 0) {
        // Skip URLs, email addresses, and other non-translatable content
        if (!this.isTranslatableText(obj)) return;
        
        texts.push({
          text: obj.trim(),
          context: `${context}${path}`,
          path
        });
      } else if (typeof obj === 'object' && obj !== null) {
        // Handle arrays
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            extractTextRecursively(item, `${path}[${index}]`);
          });
        } else {
          // Handle objects
          Object.entries(obj).forEach(([key, value]) => {
            // Skip certain keys that typically contain non-translatable content
            if (this.shouldSkipKey(key)) return;
            
            extractTextRecursively(value, `${path}.${key}`);
          });
        }
      }
    };

    extractTextRecursively(props);
    return texts;
  }

  /**
   * Extract text content from DOM elements
   */
  extractFromDOM(element: Element, context: string = 'dom'): ScannedContent[] {
    const texts: ScannedContent[] = [];
    
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          if (!text || !this.isTranslatableText(text)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (text) {
        const elementInfo = this.getElementInfo(node.parentElement);
        texts.push({
          text,
          context: `${context}.${elementInfo.tag}`,
          element: elementInfo.tag,
          path: elementInfo.path
        });
      }
    }

    return texts;
  }

  /**
   * Extract text content from API response data
   */
  extractFromApiData(data: any, context: string = 'api'): ScannedContent[] {
    const texts: ScannedContent[] = [];
    
    const extractFromData = (obj: any, path: string = '') => {
      if (typeof obj === 'string' && obj.trim().length > 0) {
        if (!this.isTranslatableText(obj)) return;
        
        texts.push({
          text: obj.trim(),
          context: `${context}${path}`,
          path
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          extractFromData(item, `${path}[${index}]`);
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          if (this.shouldSkipKey(key)) return;
          extractFromData(value, `${path}.${key}`);
        });
      }
    };

    extractFromData(data);
    return texts;
  }

  /**
   * Batch translate scanned content
   */
  async translateContent(
    contents: ScannedContent[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<{ [key: string]: string }> {
    if (contents.length === 0) return {};

    const uniqueTexts = [...new Set(contents.map(c => c.text))];
    const translationService = getTranslationService();
    const translations = await translationService.translateBatch(
      uniqueTexts,
      targetLanguage,
      sourceLanguage,
      'auto-scan'
    );

    const translationMap: { [key: string]: string } = {};
    uniqueTexts.forEach((text, index) => {
      translationMap[text] = translations[index]?.translatedText || text;
    });

    return translationMap;
  }

  /**
   * Auto-translate component data
   */
  async autoTranslateComponentData(
    data: any,
    targetLanguage: string,
    context: string = 'component'
  ): Promise<any> {
    if (targetLanguage === 'en') return data;

    // Only run on server-side
    if (typeof window !== 'undefined') {
      console.warn('Content scanner can only be used on server-side');
      return data;
    }

    const scannedContent = this.extractFromApiData(data, context);
    if (scannedContent.length === 0) return data;

    try {
      const translationMap = await this.translateContent(scannedContent, targetLanguage);
      return this.applyTranslations(data, translationMap);
    } catch (error) {
      console.error('Translation failed in content scanner:', error);
      return data; // Return original data on error
    }
  }

  /**
   * Apply translations to data structure
   */
  private applyTranslations(data: any, translationMap: { [key: string]: string }): any {
    if (typeof data === 'string') {
      return translationMap[data.trim()] || data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.applyTranslations(item, translationMap));
    }

    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      Object.entries(data).forEach(([key, value]) => {
        result[key] = this.applyTranslations(value, translationMap);
      });
      return result;
    }

    return data;
  }

  /**
   * Check if text is translatable
   */
  private isTranslatableText(text: string): boolean {
    // Skip empty or whitespace-only text
    if (!text.trim()) return false;

    // Skip URLs
    if (text.match(/^https?:\/\//)) return false;

    // Skip email addresses
    if (text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return false;

    // Skip pure numbers
    if (text.match(/^\d+(\.\d+)?$/)) return false;

    // Skip ISO dates
    if (text.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/)) return false;

    // Skip UUIDs
    if (text.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) return false;

    // Skip very short text (less than 2 characters)
    if (text.length < 2) return false;

    // Skip text that's mostly symbols/numbers
    if (text.match(/^[0-9\s\-_.,!@#$%^&*()+=\[\]{}|\\:";'<>?/`~]+$/)) return false;

    return true;
  }

  /**
   * Check if object key should be skipped during extraction
   */
  private shouldSkipKey(key: string): boolean {
    const skipKeys = [
      'id', 'uuid', 'key', 'token', 'password', 'secret',
      'url', 'uri', 'href', 'src', 'link',
      'email', 'phone', 'tel',
      'createdAt', 'updatedAt', 'timestamp', 'date',
      'lat', 'lng', 'latitude', 'longitude',
      'width', 'height', 'size', 'length',
      'version', 'build', 'hash'
    ];

    return skipKeys.some(skipKey => 
      key.toLowerCase().includes(skipKey.toLowerCase())
    );
  }

  /**
   * Get element information for context
   */
  private getElementInfo(element: Element | null): { tag: string; path: string } {
    if (!element) return { tag: 'unknown', path: '' };

    const tag = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const id = element.id ? `#${element.id}` : '';
    
    return {
      tag,
      path: `${tag}${id}${className}`
    };
  }

  /**
   * Cache scanned content to avoid repeated scanning
   */
  cacheContent(key: string, content: ScannedContent[]): void {
    this.textCache.set(key, content);
  }

  /**
   * Get cached content
   */
  getCachedContent(key: string): ScannedContent[] | undefined {
    return this.textCache.get(key);
  }

  /**
   * Clear content cache
   */
  clearCache(): void {
    this.textCache.clear();
  }
}

export const contentScanner = ContentScanner.getInstance();