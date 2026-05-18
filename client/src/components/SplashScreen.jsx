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
      {/* Centered image panel with vibrant opacity */}
      <div className="relative w-full max-w-[480px] h-full overflow-hidden opacity-85">
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

        {/* Dark overlay to make text pop while keeping vibrant colors */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />

        {/* Edge fades - matching the #0a0a0a background */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />
      </div>

      {/* Center content directly placed on background (NO CARD!) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-6">
        <div className="relative flex items-center justify-center">
          {/* Clean Spinning arc (No glow, pure vector) */}
          <svg className="absolute w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <m.circle
              cx="40" cy="40" r="34"
              fill="none" stroke="#7c3aed" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray="40 173"
              animate={{ strokeDashoffset: [0, -213] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
          {/* Logo Box (Identical to Second Image) */}
          <m.div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-black text-lg bg-white shadow-[0_0_16px_rgba(255,255,255,0.15)] relative z-10"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            T+
          </m.div>
        </div>

        <m.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-2xl font-black tracking-tighter text-white uppercase select-none">TECHPLUS</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#7c3aed] animate-ping" />
            <m.span
              className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Initializing Systems
            </m.span>
          </div>
        </m.div>
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