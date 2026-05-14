import axios from 'axios';
import { apiCache } from '../services/cacheService';

const cleanBase = (value) =>
  String(value || '')
    .trim()
    .replace(/\/api\/?$/, '')
    .replace(/\/$/, '');

const isProd = import.meta.env.PROD;
const useSameOriginApi =
  String(import.meta.env.VITE_USE_SAME_ORIGIN_API || '').toLowerCase() === 'true';
const configuredBase = cleanBase(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL);
const renderBase = cleanBase(import.meta.env.VITE_RENDER_API_URL);
const sameOriginBase =
  useSameOriginApi && typeof window !== 'undefined' ? cleanBase(window.location.origin) : '';
const CANDIDATE_BASES = [
  sameOriginBase,
  isProd ? configuredBase || renderBase : '',
  isProd ? renderBase : '',
  !isProd ? 'http://localhost:5000' : ''
].filter(Boolean).filter((base, index, bases) => bases.indexOf(base) === index);

const API_BASE_URL = CANDIDATE_BASES[0];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 60000
});

let activeBaseIndex = 0;
const switchToNextBase = () => {
  if (activeBaseIndex >= CANDIDATE_BASES.length - 1) return false;
  activeBaseIndex += 1;
  apiClient.defaults.baseURL = CANDIDATE_BASES[activeBaseIndex];
  return true;
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalConfig = error?.config || {};
    const reqUrl = originalConfig.url || '';
    const method = String(originalConfig.method || 'get').toLowerCase();
    const isAuthRequest = reqUrl.includes('/api/auth/');
    const canRetryWithNextBase =
      !isAuthRequest &&
      ['get', 'head', 'options'].includes(method) &&
      !originalConfig.__retryWithNextBase;

    if (!error?.response) {
      if (canRetryWithNextBase && switchToNextBase()) {
        originalConfig.__retryWithNextBase = true;
        originalConfig.baseURL = apiClient.defaults.baseURL;
        return apiClient.request(originalConfig);
      }

      return Promise.reject({
        success: false,
        message: 'Server timeout/unreachable. Please retry in a few seconds.'
      });
    }

    if ([404, 405, 502, 503, 504].includes(error.response.status) && canRetryWithNextBase && switchToNextBase()) {
      originalConfig.__retryWithNextBase = true;
      originalConfig.baseURL = apiClient.defaults.baseURL;
      return apiClient.request(originalConfig);
    }

    const status = error.response?.status;
    const skip401Redirect =
      reqUrl.includes('/api/user/profile') ||
      reqUrl.includes('/api/auth/login') ||
      reqUrl.includes('/api/auth/register') ||
      reqUrl.includes('/api/auth/verify-otp') ||
      reqUrl.includes('/api/auth/forgot-password') ||
      reqUrl.includes('/api/auth/reset-password');

    if (status === 401 && !skip401Redirect) {
      const path = window.location.pathname || '';
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
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
    return apiClient.post('/api/auth/logout');
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
  getAllNews: async (page = 1, category = null, refresh = false) => {
    const cacheKey = `news-${page}-${category || 'all'}`;
    if (!refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const res = await apiClient.get('/api/news/all', {
      params: {
        page,
        ...(category ? { category } : {}),
        ...(refresh ? { refresh: '1' } : {})
      }
    });
    apiCache.set(cacheKey, res, 1000 * 60 * 15); // 15 mins
    return res;
  },
  searchNews: (query) =>
    apiClient.get('/api/news/search', { params: { q: query } }),
  getById: async (id) => {
    const cacheKey = `news-detail-${id}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const res = await apiClient.get('/api/news/' + encodeURIComponent(String(id || '')));
    apiCache.set(cacheKey, res, 1000 * 60 * 60); // 1 hour
    return res;
  },
  refreshNews: () =>
    apiClient.post('/api/news/refresh')
};

export const playlistAPI = {
  getAll: async () => {
    const cacheKey = 'playlists-all';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const res = await apiClient.get('/api/playlists');
    apiCache.set(cacheKey, res, 1000 * 60 * 60 * 2); // 2 hours
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
    const cacheKey = 'roadmaps-all';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const res = await apiClient.get('/api/roadmaps');
    apiCache.set(cacheKey, res, 1000 * 60 * 60 * 24); // 24 hours
    return res;
  },
  getById: (id) => apiClient.get(`/api/roadmaps/${id}`)
};

export const hackathonAPI = {
  getAll: async (filters = {}) => {
    const cacheKey = `hackathons-${JSON.stringify(filters)}`;
    if (!filters.refresh) {
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;
    }
    const res = await apiClient.get('/api/hackathons', { params: filters });
    apiCache.set(cacheKey, res, 1000 * 60 * 30); // 30 mins
    return res;
  },
  getById: (id) =>
    apiClient.get(`/hackathons/${id}`),
  addBookmark: (hackathonId) =>
    apiClient.post('/api/hackathons/bookmark', { hackathonId }),
  removeBookmark: (hackathonId) =>
    apiClient.delete(`/api/hackathons/bookmark/${hackathonId}`),
  getUserBookmarks: () =>
    apiClient.get('/api/hackathons/user/bookmarks'),
  manualSync: () =>
    apiClient.post('/api/hackathons/sync')
};

export const clubAPI = {
  // Public
  getClubs: () => apiClient.get('/api/clubs'),
  getClubBySlug: (slug) => apiClient.get(`/api/clubs/${slug}`),
  getClubEvents: (slug) => apiClient.get(`/api/clubs/${slug}/events`),

  // Admin
  getAllEvents: (clubId) =>
    apiClient.get('/api/clubs/admin/events', clubId ? { params: { clubId } } : {}),
  createEvent: (data) => apiClient.post('/api/clubs/admin/events', data),
  updateEvent: (id, data) => apiClient.put(`/api/clubs/admin/events/${id}`, data),
  deleteEvent: (id) => apiClient.delete(`/api/clubs/admin/events/${id}`),
};

export default apiClient;

