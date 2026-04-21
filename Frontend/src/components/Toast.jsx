import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast() {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => {
                    const isSuccess = toast.type === 'success';
                    const isError = toast.type === 'error';

                    const borderStr = isSuccess ? 'rgba(34,197,94,0.3)' : isError ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)';
                    const bgStr = isSuccess ? 'rgba(34,197,94,0.1)' : isError ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)';
                    const icon = isSuccess ? 'OK' : isError ? '!!' : ' i ';

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto"
                            style={{
                                background: 'rgba(17,17,17,0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                                style={{ background: bgStr, border: `1px solid ${borderStr}`, color: borderStr.replace('0.3', '1') }}
                            >
                                {icon}
                            </div>
                            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                {toast.message}
                            </p>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    );
}
