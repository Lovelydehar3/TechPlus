/**
 * Simple localStorage-based cache for API responses.
 * Helps with perceived performance while the backend is waking up (cold starts).
 */

const CACHE_PREFIX = 'tp-cache-';
const DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes

export const apiCache = {
  set: (key, data, ttl = DEFAULT_TTL) => {
    try {
      const entry = {
        data,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // localStorage might be full or disabled
      console.warn('Cache write failed:', e);
    }
  },

  get: (key) => {
    try {
      const entryString = localStorage.getItem(CACHE_PREFIX + key);
      if (!entryString) return null;

      const entry = JSON.parse(entryString);
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return entry.data;
    } catch (e) {
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};
