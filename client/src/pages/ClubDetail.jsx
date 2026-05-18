import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { clubAPI } from '../config/api';

/* ─── Status badge colors ──────────────────────────────────────────────────── */
const STATUS_MAP = {
    Upcoming: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20',
        dot: 'bg-purple-400',
    },
    Ongoing: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        dot: 'bg-green-400',
    },
    Completed: {
        bg: 'bg-white/5',
        text: 'text-white/40',
        border: 'border-white/10',
        dot: 'bg-white/30',
    },
};

/* ─── Skeleton Loader ──────────────────────────────────────────────────────── */
const EventSkeleton = () => (
    <div className="glass p-0 overflow-hidden animate-pulse">
        <div className="h-48 bg-white/5" />
        <div className="p-5 space-y-3">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
            <div className="flex gap-4 mt-4">
                <div className="h-3 bg-white/5 rounded w-20" />
                <div className="h-3 bg-white/5 rounded w-20" />
            </div>
        </div>
    </div>
);

/* ─── Event Card Component ─────────────────────────────────────────────────── */
function EventCard({ event, index }) {
    const style = STATUS_MAP[event.status] || STATUS_MAP.Upcoming;
    const [imgError, setImgError] = useState(false);

    return (
        <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="group cinematic-card overflow-hidden"
        >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden bg-white/[0.03]">
                {event.image && !imgError ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
                        <svg width="40" height="40" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${style.bg} ${style.text} ${style.border} border backdrop-blur-sm`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${event.status === 'Ongoing' ? 'animate-pulse' : ''}`} />
                        {event.status}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
                <h3 className="text-base font-black text-white uppercase tracking-tight mb-2 line-clamp-2 group-hover:text-[#a855f7] transition-colors">
                    {event.title}
                </h3>

                {event.description && (
                    <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-3">
                        {event.description}
                    </p>
                )}

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    {event.venue && (
                        <div className="flex items-center gap-2 text-white/30">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="text-[11px] font-semibold">{event.venue}</span>
                        </div>
                    )}
                    {event.date && (
                        <div className="flex items-center gap-2 text-white/30">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="text-[11px] font-semibold">{event.date}</span>
                        </div>
                    )}
                    {event.time && (
                        <div className="flex items-center gap-2 text-white/30">
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-[11px] font-semibold">{event.time}</span>
                        </div>
                    )}
                </div>

                {/* Registration Button */}
                {event.registrationUrl && (
                    <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                        }}
                    >
                        Register Now
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                    </a>
                )}
            </div>
        </m.div>
    );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function ClubDetail() {
    const { slug } = useParams();
    const [club, setClub] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [clubRes, eventsRes] = await Promise.all([
                    clubAPI.getClubBySlug(slug),
                    clubAPI.getClubEvents(slug),
                ]);
                if (cancelled) return;
                setClub(clubRes.club);
                setEvents(eventsRes.events || []);
            } catch {
                if (!cancelled) setError('Failed to load club information.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="glow-purple w-[500px] h-[500px] -top-48 -left-48" />
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header skeleton */}
                    <div className="animate-pulse mb-12">
                        <div className="h-3 bg-white/10 rounded w-40 mb-4" />
                        <div className="h-10 bg-white/10 rounded w-64 mb-3" />
                        <div className="h-4 bg-white/5 rounded w-96" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <EventSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="min-h-screen bg-[#050505] pt-28 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/30 text-sm font-bold mb-4">{error || 'Club not found.'}</p>
                    <Link
                        to="/"
                        className="text-[#a855f7] text-sm font-bold hover:underline"
                    >
                        ← Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="glow-purple w-[500px] h-[500px] -top-48 -left-48" />
            <div className="glow-indigo w-[400px] h-[400px] bottom-0 -right-20" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-12">
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-[#a855f7] uppercase tracking-[0.3em] mb-4 hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                    </m.div>

                    <m.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-3"
                    >
                        {club.name}
                    </m.h1>

                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-2xl text-sm leading-relaxed"
                    >
                        {club.description || club.tagline}
                    </m.p>

                    {/* Event count badge */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4"
                    >
                        <span className="tag">
                            {events.length} {events.length === 1 ? 'Event' : 'Events'}
                        </span>
                    </m.div>
                </header>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass py-20 text-center"
                    >
                        <svg width="48" height="48" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">
                            No events posted yet
                        </p>
                        <p className="text-white/10 text-xs mt-2">Check back soon for updates!</p>
                    </m.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {events.map((event, idx) => (
                                <EventCard key={event._id} event={event} index={idx} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
