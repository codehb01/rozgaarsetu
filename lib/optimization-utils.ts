'use client';

/**
 * Debounce utility function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Batch utility for grouping API calls
 */
export class BatchProcessor<T, R> {
  private batch: T[] = [];
  private promises: Array<{
    resolve: (value: R) => void;
    reject: (reason?: any) => void;
  }> = [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private delay: number;
  private processor: (batch: T[]) => Promise<R[]>;

  constructor(
    processor: (batch: T[]) => Promise<R[]>,
    options: { batchSize?: number; delay?: number } = {}
  ) {
    this.processor = processor;
    this.batchSize = options.batchSize || 10;
    this.delay = options.delay || 50;
  }

  add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push(item);
      this.promises.push({ resolve, reject });

      // Process immediately if batch is full
      if (this.batch.length >= this.batchSize) {
        this.processBatch();
      } else {
        // Otherwise, schedule processing
        this.scheduleBatch();
      }
    });
  }

  private scheduleBatch = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    this.timer = setTimeout(() => {
      this.processBatch();
    }, this.delay);
  };

  private processBatch = async () => {
    if (this.batch.length === 0) return;

    const currentBatch = this.batch.splice(0);
    const currentPromises = this.promises.splice(0);
    
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      const results = await this.processor(currentBatch);
      
      currentPromises.forEach((promise, index) => {
        promise.resolve(results[index]);
      });
    } catch (error) {
      currentPromises.forEach(promise => {
        promise.reject(error);
      });
    }
  };
}

/**
 * Cache with TTL (Time To Live)
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired entries
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}