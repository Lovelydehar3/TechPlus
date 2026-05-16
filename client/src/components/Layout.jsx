import { useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen relative" style={{ background: 'var(--bg-base)' }}>

            {/* ──────── CINEMATIC ATMOSPHERE ──────── */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />
            {/* ──────────────────────────────────── */}

            <Navbar />

            <main className="pt-[64px] relative z-10">
                <AnimatePresence mode="wait">
                    <m.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <div className="max-w-[1400px] mx-auto pt-4 pb-10 md:pt-6 md:pb-10">
                            {children}
                        </div>
                    </m.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
