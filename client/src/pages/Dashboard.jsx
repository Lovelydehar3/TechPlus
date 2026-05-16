import { memo, useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { newsAPI } from '../config/api';
import { NEWS_DOMAIN_FILTERS } from '../config/newsDomains';
import { getFallbackImage } from '../utils/imageUtils';

function articleKey(item, fallback) {
  if (item?._id) return String(item._id);
  if (item?.id) return String(item.id);
  if (item?.url) return item.url;
  return `article-${fallback}`;
}

function articleRouteId(item, fallback) {
  if (item?._id) return String(item._id);
  if (item?.url) return `url-${encodeURIComponent(item.url)}`;
  return `article-${fallback}`;
}

function normalizeArticle(raw, idx) {
  const publishedAt = raw.publishedAt ? new Date(raw.publishedAt) : new Date();
  const sourceName =
    typeof raw.source === 'string'
      ? raw.source
      : raw.source?.name || raw.apiSource || 'Tech Intel';
  const category = raw.category || 'General';

  return {
    ...raw,
    id: articleKey(raw, idx),
    date: publishedAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    readingTime: raw.readingTime || '2 min read',
    category: category,
    image: raw.image || getFallbackImage(category, raw.title, raw.url, idx),
    source: sourceName
  };
}

function getSourceBadge(source) {
  const value = typeof source === 'string' ? source : source?.name || 'Tech Intel';
  if (/hacker news/i.test(value)) return 'Hacker News';
  if (/techcrunch/i.test(value)) return 'TechCrunch';
  if (/gnews/i.test(value)) return 'GNews';
  if (/newsapi/i.test(value)) return 'NewsAPI';
  return value;
}

function NewsCarouselSkeleton() {
  return (
    <div className="rounded-[40px] overflow-hidden relative aspect-[21/9] md:aspect-[3/1] border border-white/5 w-full bg-white/[0.03] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
    </div>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="p-4 md:p-6 cinematic-card border border-white/5 rounded-[32px] bg-white/[0.02] animate-pulse">
      <div className="w-full aspect-[16/9] rounded-2xl bg-white/10 mb-4" />
      <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
    </div>
  );
}

const NewsListCard = memo(function NewsListCard({ item, index, onOpen }) {
  return (
    <m.div
      className="group flex flex-col md:flex-row gap-0 cinematic-card border border-white/5 rounded-[32px] transition-all hover:border-[#7c3aed]/30 cursor-pointer overflow-hidden bg-[#111111]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onOpen(item)}
    >
      <div className="w-full md:w-[280px] lg:w-[320px] aspect-video md:aspect-auto shrink-0 relative overflow-hidden">
        <img
        src={item.image || getFallbackImage(item.category, item.title, item.url, index)}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = getFallbackImage(item.category, item.title, item.url, index);
        }}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt=""
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black text-[#a855f7] uppercase tracking-widest">
            {item.category}
          </div>
          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black text-white/70 uppercase tracking-widest">
            {getSourceBadge(item.source)}
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-8 flex flex-col justify-between gap-2 md:gap-4">
        <div className="space-y-2 md:space-y-3">
          <h3 className="text-[16px] md:text-2xl font-black text-white leading-tight lg:leading-tight group-hover:text-[#a855f7] transition-colors uppercase tracking-tight line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[12px] md:text-sm text-white/70 leading-relaxed line-clamp-2 italic">
            {item.description || 'Synthesizing full intel brief... Click to explore original report transmission.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1.5 md:mt-0 pt-3 border-t border-white/[0.03]">
          <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
            <span className="hidden md:inline truncate max-w-[80px] md:max-w-none">
              {typeof item.source === 'string' ? item.source : item.source?.name || 'Intel Source'}
            </span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-white/10 shrink-0" />
            <span>{item.date}</span>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 md:px-6 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest group-hover:bg-[#7c3aed] group-hover:text-white group-hover:border-[#7c3aed] transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="hidden sm:inline">View Intelligence</span>
            <span className="sm:hidden">Intel</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </m.div>
  );
});

export default function Dashboard() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainId, setDomainId] = useState('All');
  const [apiNotice, setApiNotice] = useState(null);
  const [cacheHint, setCacheHint] = useState(null);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const lastActivity = user?.lastActivity || null;
  const showResourceResume =
    lastActivity?.type === 'resource' &&
    lastActivity?.playbackStarted === true &&
    Boolean(lastActivity?.videoId);

  const backendCategory = useMemo(() => {
    const found = NEWS_DOMAIN_FILTERS.find((d) => d.id === domainId);
    return found?.category ?? null;
  }, [domainId]);

  const loadNews = useCallback(
    async (refresh = false, pageNum = 1) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
          setApiNotice(null);
          setCacheHint(null);
        } else {
          setLoadingMore(true);
        }

        const pageSize = pageNum === 1 ? 24 : 12; // Load 24 on initial fetch for better startup UX, 12 on subsequent
        const response = await newsAPI.getAllNews(pageNum, backendCategory, refresh, pageSize);
        const raw = response.combined?.articles || [];
        const normalized = raw.map((article, index) => normalizeArticle(article, (pageNum - 1) * (pageNum === 1 ? 24 : 12) + index));

        if (pageNum === 1) {
          setArticles(normalized);
        } else {
          setArticles(prev => {
            // Deduplicate
            const existingIds = new Set(prev.map(a => a.id));
            const uniqueNew = normalized.filter(a => !existingIds.has(a.id));
            return [...prev, ...uniqueNew];
          });
        }

        setHasMore(raw.length >= (pageNum === 1 ? 24 : 12) && pageNum < 50); // Limit to 50 pages (600 articles) for memory, but allow more pagination

        if (response.usedFallback && normalized.length > 0 && pageNum === 1) {
          setCacheHint('Showing cached articles while live feeds recover.');
        }

        if (normalized.length === 0 && response.message && pageNum === 1) {
          setApiNotice(response.message);
        }
      } catch (error) {
        if (pageNum === 1) {
          setArticles([]);
          setApiNotice(
            error?.message || 'News temporarily unavailable due to API limit. Please try later.'
          );
        }
        addToast(error?.message || 'Failed to load news', 'error');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [addToast, backendCategory]
  );

  useEffect(() => {
    setPage(1);
    loadNews(false, 1);
  }, [loadNews]);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore || searchQuery) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 800) {
        setPage(prev => {
          const next = prev + 1;
          loadNews(false, next);
          return next;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore, loadNews, searchQuery]);

  const domainKeywords = useMemo(
    () => ({
      AI: ['ai', 'artificial intelligence', 'genai', 'llm', 'openai'],
      ML: ['machine learning', 'deep learning', 'neural network', 'model training'],
      SoftwareEngineering: ['software engineering', 'architecture', 'microservices', 'distributed systems'],
      Robotics: ['robot', 'robotics', 'humanoid', 'drone', 'automation'],
      React: ['react', 'reactjs', 'react.js'],
      Node: ['node', 'nodejs', 'node.js', 'express', 'nestjs'],
      FullStack: ['full stack', 'fullstack', 'mern', 'mean', 'next.js'],
      Java: ['java', 'spring', 'jvm', 'kotlin'],
      Cpp: ['c++', 'cpp'],
      DataAnalytics: ['data analytics', 'business intelligence', 'bi', 'dashboard'],
      Web: ['web development', 'javascript', 'typescript', 'frontend', 'html', 'css'],
      Programming: ['programming', 'developer', 'coding', 'software engineering'],
      DataScience: ['data science', 'data engineering', 'data warehouse', 'big data'],
      Cloud: ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker'],
      Security: ['security', 'cybersecurity', 'vulnerability', 'zero-day'],
      Startups: ['startup', 'founder', 'funding', 'venture'],
      DeveloperTools: ['github', 'gitlab', 'copilot', 'cli', 'ide', 'sdk', 'framework'],
      OpenSource: ['open source', 'opensource', 'linux foundation', 'apache foundation']
    }),
    []
  );

  const filteredNews = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    const withDomainFilter = articles.filter((item) => {
      if (domainId === 'All') return true;
      const expectedCategory = backendCategory?.toLowerCase();
      const articleCategory = String(item.category || '').toLowerCase();
      if (expectedCategory && articleCategory === expectedCategory) return true;

      const haystack = `${item.title || ''} ${item.description || ''} ${item.content || ''}`.toLowerCase();
      const hints = domainKeywords[domainId] || [];
      return hints.some((keyword) => haystack.includes(keyword));
    });

    if (!query) return withDomainFilter;

    return withDomainFilter.filter((item) => {
      const haystack = `${item.title || ''} ${item.description || ''} ${item.content || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [articles, deferredSearchQuery, domainId, backendCategory, domainKeywords]);

  const featuredNews = useMemo(() => filteredNews.slice(0, 3), [filteredNews]);
  const remainingNews = useMemo(() => filteredNews.slice(3), [filteredNews]);
  const featuredLen = featuredNews.length;

  useEffect(() => {
    setCarouselIndex(0);
  }, [domainId, deferredSearchQuery, featuredLen]);

  useEffect(() => {
    if (featuredLen <= 1) return undefined;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredLen);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredLen]);

  const handleNext = (event) => {
    event.stopPropagation();
    setCarouselIndex((prev) => (prev + 1) % (featuredLen || 1));
  };

  const handlePrev = (event) => {
    event.stopPropagation();
    setCarouselIndex((prev) => (prev - 1 + (featuredLen || 1)) % (featuredLen || 1));
  };

  const handleResume = () => {
    if (!showResourceResume || !lastActivity?.path) {
      addToast('No saved video progress yet', 'warning');
      return;
    }
    navigate(lastActivity.path, { state: { resumeResource: true } });
  };

  const openArticle = useCallback((item) => {
    if (!item) return;
    const safeId = articleRouteId(item, Date.now());
    try {
      sessionStorage.setItem(`techplus-news-${safeId}`, JSON.stringify(item));
    } catch {
      /* ignore */
    }
    navigate(`/news/${safeId}`, { state: { article: item } });
  }, [navigate]);

  const slide = featuredNews[carouselIndex];

  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="h-auto pb-32 md:pb-24"
    >
      <div className="max-w-[1100px] mx-auto w-full px-[4px] sm:px-6 lg:px-8 pb-12 pt-8">
        <section className="relative mb-8 md:mb-12">
          {showResourceResume && (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-12 right-0 z-30"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c3aed]/30 bg-[#0a0a0c]/80 backdrop-blur-md shadow-2xl group cursor-pointer hover:border-[#7c3aed]/60 transition-all" onClick={handleResume}>
                <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Resume: {lastActivity.videoTitle || lastActivity.title}</span>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="text-[#a855f7]"><path d="M9 5l7 7-7 7" /></svg>
              </div>
            </m.div>
          )}

          <div className={showResourceResume ? 'lg:pr-[272px]' : ''}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1.5 h-6 rounded-full bg-[#7c3aed] shadow-[0_0_15px_rgba(124,58,237,0.6)] shrink-0" />
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight truncate">Latest News</h2>
                  </div>
                  <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ml-4">Technology Intelligence</p>
                </div>

                {/* Desktop Refresh Button (Visible only on sm and up) */}
                <button
                  type="button"
                  onClick={() => loadNews(true)}
                  disabled={loading}
                  title="Refresh feed"
                  className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl border border-white/15 items-center justify-center text-white/70 hover:border-[#7c3aed] hover:text-white transition-all disabled:opacity-40 group"
                >
                  <svg
                    width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                    className={`transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`}
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>

              {/* Mobile Quick Actions Row (Strict Alignment) */}
              <div className="flex sm:hidden items-center justify-between w-full mt-2">
                {/* Left: Refresh */}
                <button
                  type="button"
                  onClick={() => loadNews(true)}
                  disabled={loading}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-all"
                >
                  <svg
                    width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                    className={loading ? 'animate-spin' : ''}
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>

                {/* Right: Hot News & Group Section */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-news-sidebar'))}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative active:scale-90 transition-all"
                  >
                    <m.svg 
                        width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <m.path 
                            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.291 1-3a2.5 2.5 0 0 0 2.5 2.5z" 
                            animate={{ 
                                scale: [1, 1.05, 1],
                                stroke: ['#a855f7', '#d8b4fe', '#a855f7'],
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </m.svg>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#a855f7] rounded-full border-2 border-black" />
                  </button>

                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-clubs-panel'))}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                  >
                    <m.svg
                        width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <m.g
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </m.g>
                    </m.svg>
                  </button>
                </div>
              </div>

              {cacheHint && (
                <p className="text-xs text-amber-200/80 border border-amber-500/20 bg-amber-500/10 rounded-xl px-4 py-2">{cacheHint}</p>
              )}

              <div className="relative">
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 -mx-[4px] px-[4px] sm:mx-0 sm:px-0 scrollbar-hide">
                  {NEWS_DOMAIN_FILTERS.map((domain) => {
                    const active = domainId === domain.id;
                    return (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={() => setDomainId(domain.id)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden shrink-0 group ${
                          active
                            ? 'text-white'
                            : 'bg-white/[0.03] border border-white/5 text-white/45 hover:border-[#7c3aed]/50 hover:text-white'
                        }`}
                      >
                        {active && (
                          <m.div
                            layoutId="domain-pill"
                            className="absolute inset-0 bg-[#7c3aed] shadow-[0_0_16px_rgba(124,58,237,0.35)]"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10">{domain.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none md:hidden" />
              </div>

              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-2.5 md:py-3 pl-12 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                />
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="space-y-8 mb-16">
            <NewsCarouselSkeleton />
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          </div>
        )}

        {!loading && apiNotice && articles.length === 0 && (
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100/90">
            {apiNotice}
            <button
              type="button"
              onClick={() => loadNews(true)}
              className="mt-3 block text-[10px] font-black uppercase tracking-widest text-white underline-offset-4 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && (
          <div className="mb-14">
            <div className="relative group/carousel w-full">
              {featuredNews.length > 0 ? (
                <>
                  <div className="rounded-3xl md:rounded-[40px] overflow-hidden relative aspect-[21/10] sm:aspect-[21/9] md:aspect-[3/1] border border-white/5 shadow-2xl w-full bg-white/2">
                    <m.div
                      key={slide?.id ?? carouselIndex}
                      initial={{ opacity: 0.85 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={slide?.image || getFallbackImage(slide?.category, slide?.title, slide?.url, carouselIndex)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackImage(slide?.category, slide?.title, slide?.url, carouselIndex);
                        }}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-12 flex flex-col items-start gap-2.5 md:gap-4">
                        <div className="flex flex-wrap gap-2">
                          <div className="px-2 py-1 bg-[#7c3aed] rounded-md text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em]">
                            Featured: {slide?.category}
                          </div>
                          <div className="px-2 py-1 bg-black/50 border border-white/10 rounded-md text-[8px] md:text-[9px] font-black text-white/80 uppercase tracking-[0.2em]">
                            {getSourceBadge(slide?.source)}
                          </div>
                        </div>
                        <h2 className="text-base md:text-4xl font-black text-white leading-tight uppercase tracking-tight max-w-2xl line-clamp-2 md:line-clamp-none">
                          {slide?.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-2 md:mt-4">
                          <button
                            type="button"
                            onClick={() => openArticle(slide)}
                            className="px-4 py-2 md:px-8 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#7c3aed] hover:text-white transition-all shadow-xl active:scale-95"
                          >
                            View Intelligence
                          </button>
                          <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            <span>{slide?.date}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{slide?.readingTime}</span>
                          </div>
                        </div>
                      </div>
                    </m.div>

                    <div className="hidden md:flex absolute right-4 bottom-4 md:right-8 md:bottom-8 gap-2 md:gap-3">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#7c3aed] hover:border-[#7c3aed] transition-all group/btn active:scale-90"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-hover/btn:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#7c3aed] hover:border-[#7c3aed] transition-all group/btn active:scale-90"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-hover/btn:translate-x-0.5 transition-transform"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2.5 mt-8">
                    {featuredNews.map((dot, index) => (
                      <button
                        type="button"
                        key={dot.id}
                        onClick={() => setCarouselIndex(index)}
                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${carouselIndex === index ? 'bg-[#7c3aed] w-8' : 'bg-white/10 w-3 hover:bg-white/20'}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-16 cinematic-card border border-white/5 rounded-3xl md:rounded-[40px] text-center px-6">
                  <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mb-2">No data available</p>
                  <p className="text-white/25 text-xs mb-4">
                    {searchQuery || domainId !== 'All'
                      ? 'No articles match this filter.'
                      : apiNotice || 'No articles loaded yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => loadNews(true)}
                    className="px-6 py-2 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#7c3aed]/40 transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Latest Dossier</h3>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            {remainingNews.length > 0 && (
              <div className="flex flex-col gap-6">
                {remainingNews.map((item, index) => (
                  <NewsListCard key={item.id} item={item} index={index} onOpen={openArticle} />
                ))}
              </div>
            )}

            {loadingMore && (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#7c3aed]" />
              </div>
            )}

            {remainingNews.length === 0 && featuredNews.length > 0 && !loadingMore && (
              <div className="py-12 text-center text-white/10 text-[10px] font-black uppercase tracking-[0.2em]">End of transmission for this category</div>
            )}
          </div>
        )}
      </div>
    </m.div>
  );
}
