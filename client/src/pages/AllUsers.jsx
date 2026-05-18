import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Trash2, ShieldCheck, UserCheck, UserX, Search, X, ArrowLeft, RefreshCw, ChevronRight, UserCog } from 'lucide-react';
import { adminAPI } from '../config/api';

// These accounts cannot be deleted, unadmined, or unverified by anyone
const PERMANENT_ADMIN_EMAILS = new Set([
    'lovepreetsingh73437@gmail.com',
    'karansharma202005@gmail.com'
]);
const isPermanentAdmin = (email) => PERMANENT_ADMIN_EMAILS.has(email?.toLowerCase());

export default function AllUsers() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingRole, setTogglingRole] = useState(null);
    const [togglingVerify, setTogglingVerify] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [addModal, setAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ username: '', email: '', password: '' });
    const [adding, setAdding] = useState(false);

    const filteredUsers = users.filter(u => {
        if (roleFilter === 'admins' && u.role !== 'admin') return false;
        if (roleFilter === 'verified' && !u.isVerified) return false;
        return true;
    });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await adminAPI.getUsers({ search: searchQuery || undefined });
            setUsers(res.users || res.data?.users || []);
        } catch (err) {
            const msg = err?.message || 'Failed to fetch users';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, addToast]);

    useEffect(() => {
        if (user?.role !== 'admin') {
            addToast('Access denied.', 'error');
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate, addToast, fetchUsers]);

    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDeleteUser = async (userId) => {
        try {
            setDeleting(true);
            await adminAPI.deleteUser(userId);
            setUsers(prev => prev.filter(u => u._id !== userId));
            setDeleteModal(null);
            addToast('User deleted', 'success');
        } catch (err) {
            addToast(err?.message || 'Failed to delete user', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            setTogglingRole(userId);
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            addToast(`Role changed to ${newRole}`, 'success');
        } catch (err) {
            addToast(err?.message || 'Failed to update role', 'error');
        } finally {
            setTogglingRole(null);
        }
    };

    const handleToggleVerify = async (userId, currentVerified) => {
        try {
            setTogglingVerify(userId);
            await adminAPI.verifyUser(userId, !currentVerified);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isVerified: !currentVerified } : u));
            addToast(currentVerified ? 'User unverified' : 'User verified', 'success');
        } catch (err) {
            addToast(err?.message || 'Failed to update verification', 'error');
        } finally {
            setTogglingVerify(null);
        }
    };

    const handleAddUser = async () => {
        if (!addForm.username || !addForm.email || !addForm.password) {
            addToast('All fields are required', 'error');
            return;
        }
        if (addForm.username.length < 3) {
            addToast('Username must be at least 3 characters', 'error');
            return;
        }
        if (addForm.password.length < 6) {
            addToast('Password must be at least 6 characters', 'error');
            return;
        }
        try {
            setAdding(true);
            const res = await adminAPI.createUser(addForm);
            setUsers(prev => [res.user, ...prev]);
            setAddModal(false);
            setAddForm({ username: '', email: '', password: '' });
            addToast('User created successfully', 'success');
        } catch (err) {
            addToast(err?.message || 'Failed to create user', 'error');
        } finally {
            setAdding(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="glow-purple w-[500px] h-[500px] -top-48 -left-48" />
            <div className="glow-indigo w-[400px] h-[400px] bottom-0 -right-20" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-white/30 hover:text-[#a855f7] text-[10px] font-black uppercase tracking-widest mb-4 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back to Admin Panel
                        </button>
                        <m.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2"
                        >
                            Show All Users
                        </m.h1>
                        <p className="text-white/40 text-sm">Manage all registered users, search, change roles, verify, or delete accounts.</p>
                    </div>
                    <button
                        onClick={() => setAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#7c3aed] text-white text-xs font-bold rounded-xl hover:bg-[#6d28d9] transition-all"
                    >
                        <span className="text-lg leading-none mb-[2px]">+</span> Add New User
                    </button>
                </header>

                {/* User Table */}
                <m.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass overflow-hidden"
                >
                    {/* Toolbar */}
                    <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">User Directory</h2>
                            <span className="text-[10px] font-black bg-[#7c3aed]/20 text-[#a855f7] px-2 py-0.5 rounded">{filteredUsers.length}</span>
                            <button
                                onClick={fetchUsers}
                                disabled={loading}
                                className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 ml-2"
                                title="Refresh"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed]/50 transition-all w-full"
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#7c3aed]/50 transition-all appearance-none cursor-pointer pr-8 hidden sm:block"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                            >
                                <option value="all" className="bg-[#0f0f13]">All Users</option>
                                <option value="admins" className="bg-[#0f0f13]">Admins</option>
                                <option value="verified" className="bg-[#0f0f13]">Verified</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#7c3aed]" />
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="py-12 text-center">
                            <p className="text-red-400/80 text-sm mb-3">{error}</p>
                            <button onClick={fetchUsers} className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-xs font-bold hover:bg-white/10 hover:text-white transition-all">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Desktop Table */}
                    {!loading && !error && (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence>
                                            {filteredUsers.map((u, idx) => (
                                                <m.tr
                                                    key={u._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    className="group hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-xs font-black text-purple-400 uppercase shrink-0">
                                                                {u.username?.charAt(0) || '?'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-bold text-white group-hover:text-[#a855f7] transition-colors truncate">{u.username}</p>
                                                                    {isPermanentAdmin(u.email) && (
                                                                        <span className="px-1.5 py-0.5 rounded text-[7px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase shrink-0">Co-founder</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] text-white/30 truncate max-w-[220px]">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleToggleRole(u._id, u.role)}
                                                            disabled={togglingRole === u._id || u._id === user?._id || isPermanentAdmin(u.email)}
                                                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                                                u.role === 'admin'
                                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                                                                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                                                            } ${(u._id === user?._id || isPermanentAdmin(u.email)) ? 'cursor-default' : 'cursor-pointer'} disabled:opacity-50`}
                                                        >
                                                            {togglingRole === u._id ? '...' : u.role}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleToggleVerify(u._id, u.isVerified)}
                                                            disabled={togglingVerify === u._id || isPermanentAdmin(u.email)}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                                                                isPermanentAdmin(u.email) ? 'cursor-default' : 'cursor-pointer'
                                                            } ${
                                                                u.isVerified
                                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                                                            }`}
                                                        >
                                                            {togglingVerify === u._id ? '...' : (
                                                                <>
                                                                    {u.isVerified ? <UserCheck size={10} /> : <UserX size={10} />}
                                                                    {u.isVerified ? 'Verified' : 'Inactive'}
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-mono text-white/30 uppercase">{formatDate(u.createdAt)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {u._id !== user?._id && !isPermanentAdmin(u.email) && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleToggleRole(u._id, u.role)}
                                                                        className="p-1.5 rounded-lg bg-green-500/10 text-green-400 opacity-0 group-hover:opacity-100 hover:bg-green-500/20 transition-all"
                                                                        title="Change Role"
                                                                    >
                                                                        <UserCog size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setDeleteModal(u)}
                                                                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <ChevronRight size={14} className="text-white/20 ml-2" />
                                                        </div>
                                                    </td>
                                                </m.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-white/5">
                                <AnimatePresence>
                                    {filteredUsers.map((u, idx) => (
                                        <m.div
                                            key={u._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="p-4 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-sm font-black text-purple-400 uppercase shrink-0">
                                                        {u.username?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-white truncate">{u.username}</span>
                                                            {isPermanentAdmin(u.email) ? (
                                                                <span className="px-1.5 py-0.5 rounded text-[7px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase shrink-0">Co-founder</span>
                                                            ) : u.role === 'admin' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[7px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase shrink-0">Admin</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-white/30 truncate">{u.email}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleToggleVerify(u._id, u.isVerified)}
                                                                disabled={togglingVerify === u._id || isPermanentAdmin(u.email)}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                                                                    u.isVerified
                                                                        ? 'bg-green-500/10 text-green-400'
                                                                        : 'bg-yellow-500/10 text-yellow-400'
                                                                } disabled:opacity-50`}
                                                            >
                                                                {togglingVerify === u._id ? '...' : (
                                                                    <>
                                                                        {u.isVerified ? <UserCheck size={10} /> : <UserX size={10} />}
                                                                        {u.isVerified ? 'Verified' : 'Inactive'}
                                                                    </>
                                                                )}
                                                            </button>
                                                            <span className="text-[10px] text-white/20">{formatDate(u.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {u._id !== user?._id && !isPermanentAdmin(u.email) && (
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            onClick={() => handleToggleRole(u._id, u.role)}
                                                            disabled={togglingRole === u._id}
                                                            className={`p-2 rounded-lg text-xs transition-all ${
                                                                u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-white/40'
                                                            } disabled:opacity-50`}
                                                        >
                                                            <ShieldCheck size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal(u)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </m.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {filteredUsers.length === 0 && (
                                <div className="py-16 text-center">
                                    <p className="text-white/20 font-bold uppercase tracking-widest text-sm">
                                        {searchQuery || roleFilter !== 'all' ? 'No users matching your filters' : 'No users found'}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </m.div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => !deleting && setDeleteModal(null)}
                    >
                        <m.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass p-6 max-w-sm w-full border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Delete User</h3>
                                <button onClick={() => setDeleteModal(null)} className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <p className="text-white/50 text-sm mb-1">
                                Delete <span className="text-white font-bold">{deleteModal.username}</span>?
                            </p>
                            <p className="text-white/30 text-xs mb-6">{deleteModal.email} — This cannot be undone.</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleDeleteUser(deleteModal._id)}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/30 transition-all disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    onClick={() => setDeleteModal(null)}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Add User Modal */}
            <AnimatePresence>
                {addModal && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => !adding && setAddModal(false)}
                    >
                        <m.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass p-6 max-w-sm w-full border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Add New User</h3>
                                <button onClick={() => setAddModal(false)} className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="space-y-3 mb-6">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={addForm.username}
                                    onChange={e => setAddForm(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed]/50 transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={addForm.email}
                                    onChange={e => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed]/50 transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Password (min 6 characters)"
                                    value={addForm.password}
                                    onChange={e => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed]/50 transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddUser}
                                    disabled={adding}
                                    className="flex-1 py-2.5 rounded-xl bg-[#7c3aed] text-white text-xs font-black uppercase tracking-widest hover:bg-[#6d28d9] transition-all disabled:opacity-50"
                                >
                                    {adding ? 'Creating...' : 'Create User'}
                                </button>
                                <button
                                    onClick={() => { setAddModal(false); setAddForm({ username: '', email: '', password: '' }); }}
                                    disabled={adding}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
