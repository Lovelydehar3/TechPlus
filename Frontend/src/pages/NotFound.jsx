import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTQgNThoNHYtNGgtNHY0em0tNiAwaDR2LTRoLTR2NHptLTYgMGg0di00aC00djR6bS02IDBoNHYtNGgtNHY0em0tNiAwaDR2LTRoLTR2NHptLTYgMGg0di00aC00djR6bS02IDBoNHYtNGgtNHY0em0tNiAwaDR2LTRoLTR2NHptLTYgMGg0di00SDB2NHpNNSA0djRoNHYtNEg1em0tNSAwaDR2LTRIMHY0em0wIDZoNHYtNEgwdjR6bTAgNmg0di00SDB2NHptMCA2aDR2LTRIMHY0em0wIDZoNHYtNEgwdjR6bTAgNmg0di00SDB2NHptMCA2aDR2LTRIMHY0em0wIDZoNHYtNEgwdjR6bTAgNmg0di00SDB2NHptMCA2aDR2LTRIMHY0eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          className="relative"
        >
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-1 bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent shadow-[0_0_20px_#7c3aed] rotate-[-5deg]" />
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Signal Lost In The Void
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            The coordinates you provided do not point to any known sector in the TechPlus database. The transmission might have been intercepted or the data corrupted.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.03] border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7c3aed] text-white text-xs font-black uppercase tracking-widest hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <span className="w-12 h-[1px] bg-white/10" />
          System Error 404
          <span className="w-12 h-[1px] bg-white/10" />
        </motion.div>
      </motion.div>
    </div>
  );
}
