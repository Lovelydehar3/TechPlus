import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { ShieldCheck, UserCheck, Activity, ChevronRight } from 'lucide-react';
import { adminAPI } from '../config/api';
import ClubEventManager from '../components/ClubEventManager';
import CollegeHackathonManager from '../components/CollegeHackathonManager';

export default function AdminPanel() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getUsers();
            setUsers(res.users || res.data?.users || []);
        } catch (err) {
            addToast(err?.message || 'Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        if (user?.role !== 'admin') {
            addToast('Access denied. Admin panel is only for administrators.', 'error');
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate, addToast, fetchUsers]);

    const recentUsers = users.slice(0, 3);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const stats = [
        { label: 'Verified', value: users.filter(u => u.isVerified).length, icon: UserCheck, color: 'text-green-400' },
        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: ShieldCheck, color: 'text-purple-400' },
    ];

    if (loading && users.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7c3aed]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="glow-purple w-[500px] h-[500px] -top-48 -left-48" />
            <div className="glow-indigo w-[400px] h-[400px] bottom-0 -right-20" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-8 sm:mb-12">
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-[10px] font-black text-[#a855f7] uppercase tracking-[0.3em] mb-3 sm:mb-4"
                    >
                        <ShieldCheck size={14} />
                        System Administration
                    </m.div>
                    <m.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4"
                    >
                        Admin Control Center
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-xl text-sm sm:text-base"
                    >
                        Monitor user activity, manage permissions, and oversee the TechPlus ecosystem.
                    </m.p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {stats.map((stat, idx) => (
                        <m.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="glass p-4 sm:p-6 group hover:border-[#7c3aed]/30 transition-all duration-500"
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className={`p-2.5 sm:p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <Activity size={14} className="text-white/10" />
                            </div>
                            <h3 className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                        </m.div>
                    ))}
                </div>

                {/* Compact User Summary Card */}
                <m.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass overflow-hidden mb-8 sm:mb-12"
                >
                    <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                            Users
                            <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-white/40">{users.length}</span>
                        </h2>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-full border-2 border-purple-500 bg-purple-600 hover:bg-purple-500 active:bg-purple-800 active:scale-95 transition-all duration-200"
                        >
                            Show All
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Recent Users List */}
                    <div className="divide-y divide-white/5">
                        {recentUsers.map((u, idx) => (
                            <div key={u._id} className="px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-xs font-black text-purple-400 uppercase shrink-0">
                                    {u.username?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{u.username}</p>
                                    <p className="text-[10px] text-white/30 truncate">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {u.role === 'admin' && (
                                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">Admin</span>
                                    )}
                                    <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </div>
                            </div>
                        ))}

                        {users.length === 0 && !loading && (
                            <div className="py-10 text-center">
                                <p className="text-white/20 text-sm font-bold">No users found</p>
                            </div>
                        )}
                    </div>


                </m.div>

                {/* Club Event Manager */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 sm:mt-12"
                >
                    <ClubEventManager />
                </m.div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 sm:mt-12"
                >
                    <CollegeHackathonManager />
                </m.div>
            </div>
        </div>
    );
}
