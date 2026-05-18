import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { clubAPI } from '../config/api';

/* ─── Custom Icons ────────────────────────────────────────────────────────── */
const CosmicIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-purple-600 md:group-hover:text-purple-700 group-active:text-purple-700 transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const DataScienceIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-purple-600 md:group-hover:text-purple-700 group-active:text-purple-700 transition-colors">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const CLUB_ICONS = {
    'cosmic-club': CosmicIcon,
    'data-science-club': DataScienceIcon,
};

const getTaglineIcon = (slug) => {
    if (slug === 'cosmic-club') {
        return (
            <div className="w-3 h-3 rounded-full border-2 border-purple-400 md:group-hover:border-purple-500 group-active:border-purple-500 transition-colors" />
        );
    }
    if (slug === 'data-science-club') {
        return (
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-purple-400 md:group-hover:text-purple-500 group-active:text-purple-500 transition-colors">
                <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
        );
    }
    return (
        <div className="w-2.5 h-2.5 rounded-full border border-purple-400 md:group-hover:border-purple-500 group-active:border-purple-500 transition-colors" />
    );
};

/* ─── Skeleton Card ────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-[#f8f8fc] border border-gray-100/60 p-5 rounded-2xl animate-pulse min-h-[140px] flex flex-col justify-between">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-150 rounded w-1/2" />
            </div>
        </div>
        <div className="h-3 bg-gray-150 rounded w-full mt-4" />
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
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[90]"
                    />

                    {/* Floating Panel Wrapper */}
                    <div className="fixed inset-0 z-[91] pointer-events-none flex justify-center items-start pt-20 px-4">
                        <m.div
                            initial={{ opacity: 0, y: -20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="pointer-events-auto w-full max-w-[680px]"
                        >
                            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-gray-100 p-6 sm:p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-5 border-b border-gray-100/60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#f0effb] flex items-center justify-center text-[#7c3aed]">
                                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-[0.22em] font-sans">
                                                College Clubs
                                            </h2>
                                            <p className="text-[10px] font-black text-[#7c3aed] uppercase tracking-[0.22em] mt-1.5">
                                                Updates & Events
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-2xl border border-gray-100 hover:border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center bg-white transition-all duration-200 active:scale-95 cursor-pointer"
                                    >
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="pt-6">
                                    {loading ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <SkeletonCard />
                                            <SkeletonCard />
                                        </div>
                                    ) : error ? (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-400 text-sm font-bold">{error}</p>
                                        </div>
                                    ) : clubs.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                                                No clubs available yet
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {clubs.map((club, idx) => {
                                                const Icon = CLUB_ICONS[club.slug];
                                                return (
                                                    <m.button
                                                        key={club._id}
                                                        initial={{ opacity: 0, y: 16 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.08, duration: 0.4 }}
                                                        onClick={() => handleClubClick(club.slug)}
                                                        className="group relative text-left rounded-[20px] border border-gray-100 p-5 flex flex-col justify-between min-h-[140px] cursor-pointer transition-all duration-300 bg-white md:hover:bg-[#fcfcff] md:hover:border-[#7c3aed]/40 md:hover:shadow-[0_16px_36px_rgba(124,58,237,0.06)] md:hover:scale-[1.01] active:scale-[0.97] active:bg-[#f8f7ff] active:border-[#7c3aed]/40 active:shadow-[0_16px_36px_rgba(124,58,237,0.06)] overflow-hidden"
                                                    >
                                                        {/* Top Section */}
                                                        <div className="w-full flex items-center gap-3">
                                                            {/* Logo Icon Box */}
                                                            <div className="shrink-0 w-12 h-12 rounded-[16px] bg-[#f0effb] flex items-center justify-center border border-purple-100/30 md:group-hover:scale-105 md:group-hover:bg-[#e2e0f9] group-active:scale-95 group-active:bg-[#e2e0f9] transition-all duration-300">
                                                                {Icon ? <Icon /> : (
                                                                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black text-base group-active:text-purple-700 md:group-hover:text-purple-700 transition-colors">
                                                                        {club.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Title */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-[0.1em] md:group-hover:text-[#7c3aed] group-active:text-[#7c3aed] transition-colors leading-tight">
                                                                    {club.name}
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        {/* Inner Divider */}
                                                        <div className="w-full border-t border-gray-100/60 my-4" />

                                                        {/* Bottom Section */}
                                                        <div className="w-full flex items-center justify-between gap-2">
                                                            {/* Tagline / Subtitle */}
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                {getTaglineIcon(club.slug)}
                                                                <span className="text-xs text-gray-500 font-medium tracking-tight truncate md:group-hover:text-gray-700 group-active:text-gray-700 transition-colors">
                                                                    {club.tagline}
                                                                </span>
                                                            </div>

                                                            {/* Arrow Button */}
                                                            <div className="shrink-0 w-8 h-8 rounded-full bg-[#f0effb] border border-purple-100/30 flex items-center justify-center text-[#7c3aed] md:group-hover:bg-gradient-to-r md:group-hover:from-[#8b5cf6] md:group-hover:to-[#a855f7] md:group-hover:text-white md:group-hover:border-transparent md:group-hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)] group-active:bg-gradient-to-r group-active:from-[#8b5cf6] group-active:to-[#a855f7] group-active:text-white group-active:border-transparent group-active:shadow-[0_4px_12px_rgba(124,58,237,0.25)] transition-all duration-300">
                                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                    <path d="M9 18l6-6-6-6" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </m.button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </m.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
