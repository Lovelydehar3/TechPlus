// Simple in-memory cache with TTL for expensive operations
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or null if expired/not found
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    return this.cache.get(key);
  }

  /**
   * Set value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.cache.set(key, value);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttlMs);

    this.timers.set(key, timer);
  }

  /**
   * Delete specific cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get or compute cache value
   * @param {string} key - Cache key
   * @param {Function} computeFn - Async function to compute value if cache miss
   * @param {number} ttlMs - Time to live in milliseconds
   * @returns {Promise<any>} Cached or computed value
   */
  async getOrCompute(key, computeFn, ttlMs = 5 * 60 * 1000) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const value = await computeFn();
      this.set(key, value, ttlMs);
      return value;
    } catch (error) {
      // Don't cache errors, let caller handle it
      throw error;
    }
  }

  /**
   * Get cache stats
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default new CacheService();
