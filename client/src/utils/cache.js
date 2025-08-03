import performanceMonitor from './performance';

// Global cache for API responses
class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Generate cache key from URL and parameters
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  // Get cached data if it exists and is not expired
  get(url, params = {}) {
    const key = this.generateKey(url, params);
    const timestamp = this.timestamps.get(key);
    const data = this.cache.get(key);

    if (!data || !timestamp) {
      performanceMonitor.trackCacheMiss();
      return null;
    }

    // Check if cache is expired
    if (Date.now() - timestamp > this.defaultTTL) {
      this.delete(url, params);
      performanceMonitor.trackCacheMiss();
      return null;
    }

    performanceMonitor.trackCacheHit();
    return data;
  }

  // Set cache data with timestamp
  set(url, params = {}, data) {
    const key = this.generateKey(url, params);
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  // Delete specific cache entry
  delete(url, params = {}) {
    const key = this.generateKey(url, params);
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Get cache size for debugging
  size() {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      hitRatio: performanceMonitor.getCacheHitRatio(),
      totalRequests: performanceMonitor.metrics.cacheHits + performanceMonitor.metrics.cacheMisses,
    };
  }
}

// Create singleton instance
const apiCache = new APICache();

export default apiCache; 