
import { m } from "framer-motion";

const TILE_URLS_1 = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80",
];

const TILE_URLS_2 = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
];

const TILE_URLS_3 = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
];

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='266'%3E%3Crect width='200' height='266' fill='%230a0a0f'/%3E%3C/svg%3E";

export default function SplashScreen() {
  const imgProps = (url) => ({
    src: url,
    alt: "",
    loading: "lazy",
    onError: (e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = FALLBACK;
    },
    className:
      "w-full object-cover rounded-[20px] bg-[#111827] splash-image",
    style: {
      aspectRatio: "3/4",
    },
  });

  return (
    <div className="fixed inset-0 bg-[#070b14] overflow-hidden z-[999] flex items-center justify-center">
      {/* Background image panel */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-[200vh] grid grid-cols-3 gap-3 p-3">
          {/* LEFT */}
          <div className="flex flex-col gap-3 splash-scroll-up">
            {[...TILE_URLS_1, ...TILE_URLS_1, ...TILE_URLS_1].map(
              (url, i) => (
                <img key={`left-${i}`} {...imgProps(url)} />
              )
            )}
          </div>

          {/* CENTER */}
          <div className="flex flex-col gap-3 splash-scroll-down">
            {[...TILE_URLS_2, ...TILE_URLS_2, ...TILE_URLS_2].map(
              (url, i) => (
                <img key={`center-${i}`} {...imgProps(url)} />
              )
            )}
          </div>

          {/* RIGHT */}
          <div
            className="flex flex-col gap-3 splash-scroll-up"
            style={{ animationDelay: "-10s" }}
          >
            {[...TILE_URLS_3, ...TILE_URLS_3, ...TILE_URLS_3].map(
              (url, i) => (
                <img key={`right-${i}`} {...imgProps(url)} />
              )
            )}
          </div>
        </div>

        {/* LIGHTER premium overlay */}
        <div className="absolute inset-0 bg-[rgba(2,6,23,0.42)] z-10" />

        {/* Purple + blue cinematic glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-700/20 blur-[140px] rounded-full z-10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full z-10" />

        {/* Edge fade */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#070b14] to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070b14] to-transparent z-20" />
      </div>

      {/* CENTER CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <div className="relative flex items-center justify-center">
          {/* Rotating ring */}
          <svg
            className="absolute w-24 h-24 -rotate-90"
            viewBox="0 0 100 100"
          >
            <m.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="55 220"
              animate={{
                strokeDashoffset: [0, -275],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>

          {/* Glow behind logo */}
          <div className="absolute w-24 h-24 bg-violet-500/20 rounded-full blur-3xl" />

          {/* Logo */}
          <m.div
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-black font-black text-xl shadow-[0_0_35px_rgba(255,255,255,0.18)] relative z-10"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            T+
          </m.div>
        </div>

        {/* Text */}
        <m.div
          className="mt-7 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[34px] font-black tracking-tight text-white uppercase">
            TECHPLUS
          </h1>

          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />

            <m.p
              className="text-[11px] uppercase tracking-[0.35em] text-white/60 font-semibold"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Initializing Future Systems
            </m.p>
          </div>
        </m.div>
      </div>

      <style>{`
        .splash-image{
          filter:
            brightness(1.08)
            saturate(1.25)
            contrast(1.08);
          transition: 0.4s ease;
        }

        @keyframes splash-up {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-33.33%);
          }
        }

        @keyframes splash-down {
          0% {
            transform: translateY(-33.33%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        .splash-scroll-up {
          animation: splash-up 18s linear infinite;
        }

        .splash-scroll-down {
          animation: splash-down 18s linear infinite;
        }
      `}</style>
    </div>
  );
}