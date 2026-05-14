// SplashScreen — shows ONLY during initial auth check
// Optimized to reduce network load during the critical auth check phase.
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { newsAPI } from '../config/api';

const TILE_URLS_1 = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&q=50',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&q=50',
];
const TILE_URLS_2 = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=50',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&q=50',
];
const TILE_URLS_3 = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&q=50',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=50',
];

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='266'%3E%3Crect width='200' height='266' fill='%230b0b0f'/%3E%3C/svg%3E";

export default function SplashScreen() {
  // Prefetch news while the splash is visible, but ONLY after a delay
  // to give the critical auth request priority.
  useEffect(() => {
    const prefetch = async () => {
      try {
        // Only prefetch most critical data if server is likely awake
        await newsAPI.getAllNews(1, null, false);
      } catch {
        // non-fatal
      }
    };
    
    const timer = setTimeout(prefetch, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const imgProps = (url, i, col) => ({
    key: `${col}-${i}`,
    src: url,
    alt: '',
    onError: (e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; },
    className: 'w-full object-cover rounded-lg bg-[#111]',
    style: { aspectRatio: '3/4' },
    loading: 'lazy',
  });

  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[999] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7c3aed]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Centered image panel */}
      <div className="relative w-full max-w-[480px] h-full overflow-hidden opacity-40">
        {/* Scrolling columns - fewer images for faster load */}
        <div className="absolute top-0 left-0 w-full h-[200vh] grid grid-cols-3 gap-2 p-2">
          <div className="flex flex-col gap-2 splash-scroll-up">
            {[...TILE_URLS_1, ...TILE_URLS_1, ...TILE_URLS_1].map((url, i) => <img {...imgProps(url, i, 'c1')} />)}
          </div>
          <div className="flex flex-col gap-2 splash-scroll-down">
            {[...TILE_URLS_2, ...TILE_URLS_2, ...TILE_URLS_2].map((url, i) => <img {...imgProps(url, i, 'c2')} />)}
          </div>
          <div className="flex flex-col gap-2 splash-scroll-up" style={{ animationDelay: '-12s' }}>
            {[...TILE_URLS_3, ...TILE_URLS_3, ...TILE_URLS_3].map((url, i) => <img {...imgProps(url, i, 'c3')} />)}
          </div>
        </div>

        {/* Edge fades */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
      </div>

      {/* Center: logo + spinner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-6">
        <div className="relative flex items-center justify-center">
          {/* Pulse rings */}
          <motion.div
            className="absolute w-24 h-24 rounded-full border border-[#7c3aed]/30"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Spinning arc */}
          <svg className="absolute w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <motion.circle
              cx="40" cy="40" r="34"
              fill="none" stroke="#7c3aed" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="40 173"
              animate={{ strokeDashoffset: [0, -213] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
          {/* Logo */}
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-black text-lg bg-white shadow-[0_0_30px_rgba(255,255,255,0.25)] relative z-10"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            T+
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-2xl font-black tracking-tighter text-white uppercase">TECHPLUS</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#7c3aed] animate-ping" />
            <motion.span
              className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initializing Systems
            </motion.span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes splash-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        @keyframes splash-down {
          0% { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
        .splash-scroll-up  { animation: splash-up   20s linear infinite; }
        .splash-scroll-down { animation: splash-down 20s linear infinite; }
      `}</style>
    </div>
  );
}

