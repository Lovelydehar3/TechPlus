import axios from 'axios';
import { apiCache } from '../services/cacheService';

export const AUTH_TOKEN_KEY = 'techplus_auth_token';

const cleanBase = (value) =>
  String(value || '')
    .replace(/\\n|\\r/g, '')
    .replace(/\r|\n/g, '')
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/\/api\/?$/i, '')
    .replace(/\/$/, '');

const envFlag = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());
const isProd = import.meta.env.PROD;

const configuredBase = cleanBase(
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_RENDER_API_URL
);

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
const isVercelHost = /\.vercel\.app$/i.test(runtimeHost);
const isRenderHost = /\.onrender\.com$/i.test(runtimeHost);
const useSameOriginApi =
  envFlag(import.meta.env.VITE_USE_SAME_ORIGIN_API) ||
  isVercelHost ||
  (!configuredBase && isRenderHost && !isVercelHost);

// Use the configured backend URL if explicitly set; otherwise default to same-origin.
// In dev, Vite proxy handles /api/* → localhost:5000.
// In prod on Vercel, vercel.json rewrites /api/* → Render backend.
const API_BASE_URL = useSameOriginApi ? '' : (configuredBase || '');

export const getAuthToken = () => {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined' || !token) return;
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Storage can be disabled in private browsing; the httpOnly cookie still works.
  }
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  // 12s timeout — fast enough for good UX, long enough for cold start
  timeout: 12000
});

// FIX #4: Retry logic for network errors and 5xx responses (cold start resilience)
apiClient.interceptors.response.use(null, async (error) => {
  const config = error?.config;
  if (!config) return Promise.reject(error);

  // Don't retry if already retried, or if it's a canceled request
  if (config.__retryCount === undefined) config.__retryCount = 0;
  if (config.__retryCount >= 1) return Promise.reject(error);
  if (error?.code === 'ERR_CANCELED') return Promise.reject(error);

  // Only retry on network errors or 5xx, never on 4xx
  const status = error?.response?.status;
  const isNetworkError = !error?.response;
  const isServerError = status >= 500;

  if (!isNetworkError && !isServerError) return Promise.reject(error);

  config.__retryCount += 1;
  // 1.5s fixed delay — short enough for cold start recovery
  await new Promise(r => setTimeout(r, 1500));
  return apiClient(config);
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const contentType = String(response.headers?.['content-type'] || '');
    const data = response.data;
    const looksLikeHtml =
      typeof data === 'string' &&
      (contentType.includes('text/html') || /<!doctype html|<html/i.test(data.slice(0, 200)));

    if (looksLikeHtml) {
      return Promise.reject({
        success: false,
        status: response.status,
        code: 'API_MISROUTED',
        message: 'API request returned the frontend app. Check VITE_API_URL and Vercel rewrites.'
      });
    }

    return data;
  },
  async (error) => {
    if (error?.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    if (error?.success === false) {
      return Promise.reject(error);
    }

    const reqUrl = error?.config?.url || '';

    if (!error?.response) {
      return Promise.reject({
        success: false,
        status: 0,
        code: error?.code || 'NETWORK_ERROR',
        message: isProd
          ? 'Server is waking up. Please wait a moment and try again.'
          : 'Cannot connect to the server. Make sure the backend is running on port 5000.'
      });
    }

    const status = error.response?.status;
    const responseData = error.response?.data;
    const normalizedError =
      responseData && typeof responseData === 'object'
        ? responseData
        : { message: responseData || error.message || 'Request failed' };

    const skip401Redirect =
      reqUrl.includes('/api/auth/') ||
      reqUrl.includes('/api/user/');

    if (status === 401) {
      // Only clear token + redirect for non-auth API calls
      // Auth endpoints (/me, /login, etc.) handle their own 401s
      if (!skip401Redirect && typeof window !== 'undefined') {
        clearAuthToken();
        const path = window.location.pathname || '';
        if (!path.startsWith('/login') && !path.startsWith('/register') && !path.startsWith('/verify-email')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject({
      success: false,
      status,
      ...normalizedError
    });
  }
);

export const authAPI = {
  me: (config = {}) => apiClient.get('/api/auth/me', config),
  register: (email, username, password, confirmPassword) =>
    apiClient.post('/api/auth/register', { email, username, password, confirmPassword }),
  verifyOtp: (email, otp) =>
    apiClient.post('/api/auth/verify-otp', { email, otp }),
  resendOtp: (email) =>
    apiClient.post('/api/auth/resend-otp', { email }),
  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),
  logout: () => {
    apiCache.clear();
    return apiClient.post('/api/auth/logout').finally(clearAuthToken);
  },
  forgotPassword: (email, clientOrigin) =>
    apiClient.post('/api/auth/forgot-password', { email, clientOrigin }),
  resetPassword: (token, password, confirmPassword) =>
    apiClient.post('/api/auth/reset-password', { token, password, confirmPassword })
};

export const userAPI = {
  getProfile: () =>
    apiClient.get('/api/user/profile'),
  updateProfile: (data) =>
    apiClient.put('/api/user/update', data),
  deleteAccount: (password) =>
    apiClient.delete('/api/user/account', { data: { password } }),
  updateLastActivity: (data) =>
    apiClient.put('/api/user/last-activity', data),
  addBookmark: (bookmarkData) =>
    apiClient.post('/api/user/bookmarks', bookmarkData),
  getBookmarks: () =>
    apiClient.get('/api/user/bookmarks'),
  deleteBookmark: (bookmarkId) =>
    apiClient.delete(`/api/user/bookmarks/${bookmarkId}`),
  updateRoadmapProgress: (data) =>
    apiClient.put('/api/user/roadmap-progress', data),
  getRoadmapProgress: (roadmapId) =>
    apiClient.get(`/api/user/roadmap-progress/${roadmapId}`),
  uploadProfileImage: (imageData) =>
    apiClient.post('/api/user/upload-profile', { imageData }),
  recordRoadmapDownload: (data) =>
    apiClient.post('/api/user/record-roadmap-download', data),
  getSavedResources: () =>
    apiClient.get('/api/user/saved-resources'),
  saveResource: (playlistId) =>
    apiClient.post('/api/user/saved-resources', { playlistId }),
  removeSavedResource: (playlistId) =>
    apiClient.delete(`/api/user/saved-resources/${playlistId}`)
};

export const newsAPI = {
  getTechNews: (page = 1) =>
    apiClient.get('/api/news/newsapi', { params: { page } }),
  getGTechNews: (query = 'technology', page = 1) =>
    apiClient.get('/api/news/gnews', { params: { query, page } }),
  getAllNews: async (page = 1, category = null, refresh = false, limit = null) => {
    const cacheKey = `news-${page}-${category || 'all'}${limit ? `-${limit}` : ''}`;
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const res = await apiClient.get('/api/news/all', {
      params: {
        page,
        ...(category ? { category } : {}),
        ...(refresh ? { refresh: '1' } : {}),
        ...(limit ? { limit } : {})
      }
    });
    apiCache.set(cacheKey, res, 1000 * 60 * 15);
    return res;
  },
  searchNews: (query) =>
    apiClient.get('/api/news/search', { params: { q: query } }),
  getById: async (id) => {
    const cacheKey = `news-detail-${id}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/api/news/' + encodeURIComponent(String(id || '')));
    apiCache.set(cacheKey, res, 1000 * 60 * 60);
    return res;
  },
  refreshNews: () =>
    apiClient.post('/api/news/refresh'),
  deleteArticle: (id) => {
    apiCache.clear();
    return apiClient.delete('/api/news/' + encodeURIComponent(String(id || '')));
  }
};

export const playlistAPI = {
  getAll: async () => {
    const cacheKey = 'playlists-all';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/api/playlists');
    apiCache.set(cacheKey, res, 1000 * 60 * 60 * 2);
    return res;
  },
  getById: (id) => apiClient.get(`/api/playlists/${id}`),
  getYouTubePlaylist: (playlistId, payload = {}) =>
    apiClient.get(`/api/playlists/youtube/${encodeURIComponent(String(playlistId || ''))}`, {
      params: {
        ...(payload.title ? { title: payload.title } : {}),
        ...(payload.description ? { description: payload.description } : {})
      }
    }),
  reseed: () => apiClient.post('/api/playlists/reseed')
};

export const roadmapAPI = {
  getAll: async () => {
    const cacheKey = 'roadmaps-all-v2';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/api/roadmaps');
    apiCache.set(cacheKey, res, 1000 * 60 * 60 * 24);
    return res;
  },
  getById: (id) => apiClient.get(`/api/roadmaps/${id}`)
};

export const clearHackathonListCache = () => {
  apiCache.clear();
};

export const hackathonAPI = {
  getAll: async (filters = {}) => {
    const cacheKey = `hackathons-${JSON.stringify(filters)}`;
    if (!filters.refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const res = await apiClient.get('/api/hackathons', {
      params: filters,
      headers: filters.refresh ? { 'Cache-Control': 'no-cache' } : undefined,
    });
    if (!filters.refresh) {
      apiCache.set(cacheKey, res, 1000 * 60 * 5);
    }
    return res;
  },
  getById: (id) =>
    apiClient.get(`/api/hackathons/${id}`),
  addBookmark: (hackathonId) =>
    apiClient.post('/api/hackathons/bookmark', { hackathonId }),
  removeBookmark: (hackathonId) =>
    apiClient.delete(`/api/hackathons/bookmark/${hackathonId}`),
  getUserBookmarks: () =>
    apiClient.get('/api/hackathons/user/bookmarks'),
  manualSync: () =>
    apiClient.post('/api/hackathons/sync'),
  getCollegeAdmin: () =>
    apiClient.get('/api/hackathons/admin/college'),
  createCollege: (data) => {
    clearHackathonListCache();
    return apiClient.post('/api/hackathons/admin/college', data).then((res) => {
      window.dispatchEvent(new CustomEvent('hackathons-changed'));
      return res;
    });
  },
  updateCollege: (id, data) => {
    clearHackathonListCache();
    return apiClient.put(`/api/hackathons/admin/college/${id}`, data).then((res) => {
      window.dispatchEvent(new CustomEvent('hackathons-changed'));
      return res;
    });
  },
  deleteCollege: (id) => {
    clearHackathonListCache();
    return apiClient.delete(`/api/hackathons/admin/college/${id}`).then((res) => {
      window.dispatchEvent(new CustomEvent('hackathons-changed'));
      return res;
    });
  }
};

export const clubAPI = {
  getClubs: () => apiClient.get('/api/clubs'),
  getClubBySlug: (slug) => apiClient.get(`/api/clubs/${slug}`),
  getClubEvents: (slug) => apiClient.get(`/api/clubs/${slug}/events`),
  getAllEvents: (clubId) =>
    apiClient.get('/api/clubs/admin/events', clubId ? { params: { clubId } } : {}),
  createEvent: (data) => apiClient.post('/api/clubs/admin/events', data),
  updateEvent: (id, data) => apiClient.put(`/api/clubs/admin/events/${id}`, data),
  deleteEvent: (id) => apiClient.delete(`/api/clubs/admin/events/${id}`)
};

export const adminAPI = {
  getUsers: (params = {}) =>
    apiClient.get('/api/admin/users', { params }),
  createUser: (data) =>
    apiClient.post('/api/admin/users', data),
  deleteUser: (userId) =>
    apiClient.delete(`/api/admin/users/${userId}`),
  updateUserRole: (userId, role) =>
    apiClient.put(`/api/admin/users/${userId}/role`, { role }),
  verifyUser: (userId, isVerified) =>
    apiClient.put(`/api/admin/users/${userId}/verify`, { isVerified }),
};

// Pre-warm: wake the server on app load (fire-and-forget)
if (typeof window !== 'undefined') {
  const warmUrl = `${API_BASE_URL}/api/health`;
  fetch(warmUrl, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
}

export default apiClient;
