import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clubAPI } from '../config/api';

/* ─── Inline SVG logos ─────────────────────────────────────────────────────── */
const ComicLogo = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="comic-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <filter id="comic-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="rgba(168,85,247,0.08)" stroke="url(#comic-grad)" strokeWidth="1.5" />
        {/* Speech bubble */}
        <path d="M16 18h24c2.2 0 4 1.8 4 4v14c0 2.2-1.8 4-4 4H28l-6 6v-6h-6c-2.2 0-4-1.8-4-4V22c0-2.2 1.8-4 4-4z" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5" filter="url(#comic-glow)" />
        {/* Lightning bolt inside bubble */}
        <path d="M30 22l-6 10h6l-2 10 8-12h-6l4-8z" fill="#a855f7" opacity="0.9" />
        {/* Star accents */}
        <circle cx="48" cy="16" r="2" fill="#d8b4fe" opacity="0.6" />
        <circle cx="52" cy="22" r="1.2" fill="#c084fc" opacity="0.4" />
    </svg>
);

const DataScienceLogo = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ds-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
            <filter id="ds-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="rgba(99,102,241,0.08)" stroke="url(#ds-grad)" strokeWidth="1.5" />
        {/* Brain / network nodes */}
        <circle cx="32" cy="24" r="4" fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth="1.5" filter="url(#ds-glow)" />
        <circle cx="20" cy="34" r="3" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="1.2" />
        <circle cx="44" cy="34" r="3" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="1.2" />
        <circle cx="26" cy="46" r="2.5" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <circle cx="38" cy="46" r="2.5" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        {/* Connection lines */}
        <line x1="32" y1="28" x2="20" y2="31" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <line x1="32" y1="28" x2="44" y2="31" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="37" x2="26" y2="43.5" stroke="#6366f1" strokeWidth="0.8" opacity="0.4" />
        <line x1="44" y1="37" x2="38" y2="43.5" stroke="#6366f1" strokeWidth="0.8" opacity="0.4" />
        <line x1="26" y1="46" x2="38" y2="46" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
        {/* Bar chart accent */}
        <rect x="14" y="50" width="3" height="6" rx="1" fill="#a855f7" opacity="0.4" />
        <rect x="19" y="48" width="3" height="8" rx="1" fill="#6366f1" opacity="0.5" />
        <rect x="24" y="46" width="3" height="10" rx="1" fill="#a855f7" opacity="0.6" />
    </svg>
);

const CLUB_LOGOS = {
    'comic-club': ComicLogo,
    'data-science-club': DataScienceLogo,
};

/* ─── Skeleton Card ────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="glass p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
        <div className="h-3 bg-white/5 rounded w-full" />
    </div>
);

/* ─── Main Panel Component ─────────────────────────────────────────────────── */
export default function ClubsPanel({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;
        const fetchClubs = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await clubAPI.getClubs();
                if (!cancelled) setClubs(res.clubs || []);
            } catch {
                if (!cancelled) setError('Could not load clubs.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchClubs();
        return () => { cancelled = true; };
    }, [isOpen]);

    const handleClubClick = (slug) => {
        onClose();
        navigate(`/clubs/${slug}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
                    />

                    {/* Floating Panel Wrapper */}
                    <div className="fixed inset-0 z-[91] pointer-events-none flex justify-center items-start pt-20 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="pointer-events-auto w-full max-w-[680px]"
                        >
                        <div
                            className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                            style={{
                                background: 'linear-gradient(145deg, rgba(10,10,14,0.97) 0%, rgba(16,10,28,0.97) 100%)',
                                backdropFilter: 'blur(40px)',
                                WebkitBackdropFilter: 'blur(40px)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                            College Clubs
                                        </h2>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">
                                            Updates & Events
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {loading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <SkeletonCard />
                                        <SkeletonCard />
                                    </div>
                                ) : error ? (
                                    <div className="py-12 text-center">
                                        <p className="text-white/30 text-sm font-bold">{error}</p>
                                    </div>
                                ) : clubs.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">
                                            No clubs available yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {clubs.map((club, idx) => {
                                            const Logo = CLUB_LOGOS[club.slug];
                                            return (
                                                <motion.button
                                                    key={club._id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                                    onClick={() => handleClubClick(club.slug)}
                                                    className="group relative text-left rounded-2xl border border-white/[0.06] p-5 transition-all duration-500 hover:border-[#7c3aed]/40 cursor-pointer overflow-hidden"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.02)',
                                                    }}
                                                >
                                                    {/* Hover glow */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                                        style={{
                                                            background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
                                                        }}
                                                    />

                                                    <div className="relative z-10 flex items-start gap-4">
                                                        {/* Logo */}
                                                        <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-white/[0.03] border border-white/[0.06] group-hover:border-[#7c3aed]/30 transition-all duration-500 group-hover:scale-105">
                                                            {Logo ? <Logo /> : (
                                                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-lg">
                                                                    {club.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base font-black text-white uppercase tracking-tight group-hover:text-[#a855f7] transition-colors">
                                                                {club.name}
                                                            </h3>
                                                            <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                                                className="text-xs text-white/40 mt-1 font-semibold"
                                                            >
                                                                {club.tagline}
                                                            </motion.p>
                                                        </div>

                                                        {/* Arrow */}
                                                        <div className="shrink-0 mt-1 text-white/10 group-hover:text-[#a855f7] transition-all group-hover:translate-x-1">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M9 18l6-6-6-6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
