// SplashScreen shows only during the initial auth check.
import { m } from 'framer-motion';

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
  const imgProps = (url) => ({
    src: url,
    alt: '',
    onError: (e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; },
    className: 'w-full object-cover rounded-lg bg-[#111]',
    style: { aspectRatio: '3/4' },
    loading: 'lazy',
  });

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[999] overflow-hidden">
      {/* Centered image panel */}
      <div className="relative w-full max-w-[480px] h-full overflow-hidden opacity-40">
        {/* Scrolling columns - fewer images for faster load */}
        <div className="absolute top-0 left-0 w-full h-[200vh] grid grid-cols-3 gap-2 p-2">
          <div className="flex flex-col gap-2 splash-scroll-up">
            {[...TILE_URLS_1, ...TILE_URLS_1, ...TILE_URLS_1].map((url, i) => (
              <img key={`c1-${i}`} {...imgProps(url)} />
            ))}
          </div>
          <div className="flex flex-col gap-2 splash-scroll-down">
            {[...TILE_URLS_2, ...TILE_URLS_2, ...TILE_URLS_2].map((url, i) => (
              <img key={`c2-${i}`} {...imgProps(url)} />
            ))}
          </div>
          <div className="flex flex-col gap-2 splash-scroll-up" style={{ animationDelay: '-12s' }}>
            {[...TILE_URLS_3, ...TILE_URLS_3, ...TILE_URLS_3].map((url, i) => (
              <img key={`c3-${i}`} {...imgProps(url)} />
            ))}
          </div>
        </div>

        {/* Edge fades - matching the #0a0a0a background */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      </div>

      {/* Center White Card - matching Login Card style */}
      <m.div
        className="absolute w-[90%] max-w-[360px] bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 z-20"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo - Matching Login Page Header style */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-base bg-white shadow-[0_0_16px_rgba(0,0,0,0.08)] border border-gray-100">
            T+
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">TECHPLUS</span>
        </div>

        {/* Clean Vector Spinner - No lighting/glow effects */}
        <div className="relative flex items-center justify-center w-10 h-10">
          <svg className="animate-spin h-7 w-7 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        {/* Loading details */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] animate-pulse">Initializing Systems</span>
        </div>
      </m.div>

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

