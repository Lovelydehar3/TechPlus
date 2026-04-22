import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsAPI } from '../config/api';

const NEWS_IMG_FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&q=60';

export default function NewsSidebar({ isOpen, onClose }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setNotice(null);
        const response = await newsAPI.getAllNews(1);
        if (cancelled) return;
        const raw = response.combined?.articles || [];
        setArticles(raw);
        if (raw.length === 0) {
          setNotice(response.message || 'News not available right now. Please try later.');
        } else if (response.usedFallback) {
          setNotice('Showing cached articles.');
        }
      } catch {
        if (!cancelled) {
          setArticles([]);
          setNotice('News not available right now. Please try later.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArticles();
    return () => { cancelled = true; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-[380px] bg-[#0a0a0c] border-r border-white/10 z-[101] overflow-y-auto shadow-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(10,10,12,1) 0%, rgba(20,10,30,1) 100%)' }}
          >
            <div className="p-6 flex flex-col gap-6 min-h-full">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">News Feed</h2>
                </div>
                <button
                  type="button" onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Notice */}
              {notice && (
                <p className="text-xs text-amber-200/90 border border-amber-500/20 rounded-xl px-3 py-2 bg-amber-500/10">
                  {notice}
                </p>
              )}

              {/* Content */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-14 h-14 shrink-0 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-white/10 rounded w-full" />
                        <div className="h-3 bg-white/5 rounded w-3/4" />
                        <div className="h-2 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="flex flex-col gap-5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    {articles.length} articles
                  </p>
                  {articles.map((item, idx) => (
                    <div
                      key={item._id || item.url || idx}
                      onClick={() => {
                        if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
                        onClose();
                      }}
                      className="flex gap-3 group cursor-pointer items-start hover:opacity-80 transition-opacity"
                    >
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                        <img
                          src={item.image || NEWS_IMG_FALLBACK}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = NEWS_IMG_FALLBACK; }}
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-white/70 group-hover:text-white transition-colors leading-snug uppercase tracking-tight line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-white/40 line-clamp-1">{item.source?.name || 'News'}</p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loading && !notice ? (
                <div className="text-center text-white/40 text-sm py-12">
                  News not available right now.
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
