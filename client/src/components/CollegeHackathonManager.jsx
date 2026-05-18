import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { hackathonAPI } from '../config/api';
import { useToast } from '../context/ToastContext';

function FormField({ label, children, required }) {
    return (
        <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {label} {required && <span className="text-purple-500">*</span>}
            </label>
            {children}
        </div>
    );
}

const MODE_OPTIONS = ['Online', 'Offline', 'Hybrid'];

const EMPTY_FORM = {
    title: '',
    description: '',
    image: '',
    location: '',
    mode: 'Offline',
    startDate: '',
    endDate: '',
    time: '',
    registrationLink: '',
    organizer: '',
    prize: '',
    tags: '',
};

function toDateTimeLocalValue(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
}

export default function CollegeHackathonManager() {
    const { addToast } = useToast();
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deletingId, setDeletingId] = useState(null);

    const fetchHackathons = useCallback(async () => {
        try {
            setLoading(true);
            const res = await hackathonAPI.getCollegeAdmin();
            setHackathons(res.hackathons || []);
        } catch {
            addToast('Failed to load college hackathons', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchHackathons();
    }, [fetchHackathons]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const openCreateForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };

    const openEditForm = (hackathon) => {
        setEditingId(hackathon._id);
        setForm({
            title: hackathon.title || '',
            description: hackathon.description || '',
            image: hackathon.image || '',
            location: hackathon.location || '',
            mode: hackathon.mode || 'Offline',
            startDate: toDateTimeLocalValue(hackathon.startDate),
            endDate: toDateTimeLocalValue(hackathon.endDate),
            time: hackathon.time || '',
            registrationLink: hackathon.registrationLink || '',
            organizer: hackathon.organizer || '',
            prize: hackathon.prize || '',
            tags: Array.isArray(hackathon.tags) ? hackathon.tags.join(', ') : '',
        });
        setShowForm(true);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            addToast('Hackathon title is required', 'error');
            return false;
        }
        if (!form.startDate || !form.endDate) {
            addToast('Start and end date/time are required', 'error');
            return false;
        }
        if (new Date(form.endDate) < new Date(form.startDate)) {
            addToast('End must be after start', 'error');
            return false;
        }
        if (form.registrationLink && !/^https?:\/\/.+/.test(form.registrationLink)) {
            addToast('Registration link must start with http:// or https://', 'error');
            return false;
        }
        if (form.image && !/^https?:\/\/.+/.test(form.image)) {
            addToast('Image URL must start with http:// or https://', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            ...form,
            startDate: new Date(form.startDate).toISOString(),
            endDate: new Date(form.endDate).toISOString(),
        };

        try {
            setSubmitting(true);
            if (editingId) {
                await hackathonAPI.updateCollege(editingId, payload);
                addToast('College hackathon updated', 'success');
            } else {
                await hackathonAPI.createCollege(payload);
                addToast('College hackathon created', 'success');
            }
            cancelForm();
            fetchHackathons();
            window.dispatchEvent(new Event('hackathons-changed'));
        } catch (err) {
            addToast(err?.message || 'Operation failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await hackathonAPI.deleteCollege(id);
            addToast('College hackathon deleted', 'success');
            setDeletingId(null);
            fetchHackathons();
            window.dispatchEvent(new Event('hackathons-changed'));
        } catch {
            addToast('Failed to delete hackathon', 'error');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatRange = (hackathon) => {
        const start = formatDate(hackathon.startDate);
        const end = formatDate(hackathon.endDate);
        if (start === '—' && end === '—') return '—';
        return `${start} → ${end}`;
    };

    const modeColors = {
        Online: 'bg-blue-500/10 text-blue-400',
        Offline: 'bg-orange-500/10 text-orange-400',
        Hybrid: 'bg-green-500/10 text-green-400',
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#a855f7] uppercase tracking-[0.3em] mb-2">
                        College Hackathons
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                        Manage College Hackathons
                    </h2>
                    <p className="text-white/35 text-xs mt-2 max-w-xl">
                        Featured at the top of the Hackathons page for all users.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="btn-primary !w-auto px-6 !py-2.5 text-xs flex items-center gap-2"
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Hackathon
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-[80px] pb-[100px] md:py-12 bg-black/40 backdrop-blur-sm"
                        onClick={cancelForm}
                    >
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[24px] p-5 sm:p-8 w-full md:max-w-2xl shadow-2xl relative flex flex-col max-h-full md:max-h-[80vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                            {editingId ? 'Edit Hackathon' : 'Add College Hackathon'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">Fill in the details to add a new college hackathon</p>
                                    </div>
                                </div>
                                <button type="button" onClick={cancelForm} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="overflow-y-auto pr-2 custom-scrollbar-dark flex-1 min-h-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <FormField label="Title" required>
                                        <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" maxLength={200} />
                                    </FormField>

                                    <FormField label="Organizer / College">
                                        <input type="text" value={form.organizer} onChange={(e) => handleChange('organizer', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="Your college name" />
                                    </FormField>

                                    <FormField label="Mode" required>
                                        <select value={form.mode} onChange={(e) => handleChange('mode', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all">
                                            {MODE_OPTIONS.map((mode) => (
                                                <option key={mode} value={mode}>{mode}</option>
                                            ))}
                                        </select>
                                    </FormField>

                                    <FormField label="Location">
                                        <input type="text" value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="Campus / city" />
                                    </FormField>

                                    <FormField label="Start date & time" required>
                                        <input type="datetime-local" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" />
                                    </FormField>

                                    <FormField label="End date & time" required>
                                        <input type="datetime-local" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" />
                                    </FormField>

                                    <FormField label="Time label (optional)">
                                        <input type="text" value={form.time} onChange={(e) => handleChange('time', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="e.g. 10:00 AM - 6:00 PM" />
                                    </FormField>

                                    <FormField label="Prize">
                                        <input type="text" value={form.prize} onChange={(e) => handleChange('prize', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="e.g. ₹50,000 pool" />
                                    </FormField>

                                    <FormField label="Registration link">
                                        <input type="url" value={form.registrationLink} onChange={(e) => handleChange('registrationLink', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="https://..." />
                                    </FormField>

                                    <FormField label="Banner image URL">
                                        <input type="url" value={form.image} onChange={(e) => handleChange('image', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="https://..." />
                                    </FormField>

                                    <FormField label="Tags (comma separated)">
                                        <input type="text" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all" placeholder="AI, Web3" />
                                    </FormField>

                                    <div className="sm:col-span-2">
                                        <FormField label="Description">
                                            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full bg-[#f0f4f8] text-gray-900 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all resize-none" maxLength={2000} />
                                        </FormField>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100 shrink-0">
                                    <button
                                        type="button"
                                        onClick={cancelForm}
                                        className="hidden sm:flex px-8 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-all items-center justify-center"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#a855f7] text-white text-sm font-bold hover:bg-[#9333ea] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                {editingId ? 'Update Hackathon' : 'Create Hackathon'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>

            <m.div className="glass overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-white/5">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                        College listings
                        <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-white/40">{hackathons.length}</span>
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#7c3aed]" />
                    </div>
                ) : hackathons.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No college hackathons yet</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-white/20 uppercase tracking-[0.15em] border-b border-white/5">
                                        <th className="px-5 py-4">Title</th>
                                        <th className="px-5 py-4">Mode</th>
                                        <th className="px-5 py-4">Schedule</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {hackathons.map((hackathon) => (
                                        <tr key={hackathon._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-bold text-white/80 group-hover:text-[#a855f7] transition-colors line-clamp-1">{hackathon.title}</span>
                                                <span className="block text-[10px] text-white/30 mt-1">{hackathon.location || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${modeColors[hackathon.mode] || modeColors.Offline}`}>
                                                    {hackathon.mode}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-[10px] text-white/30 font-mono">{formatRange(hackathon)}</td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button type="button" onClick={() => openEditForm(hackathon)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-[#a855f7] hover:bg-purple-500/10 transition-all" title="Edit">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    {deletingId === hackathon._id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button type="button" onClick={() => handleDelete(hackathon._id)} className="px-2 py-1 rounded text-[9px] font-black bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Confirm</button>
                                                            <button type="button" onClick={() => setDeletingId(null)} className="px-2 py-1 rounded text-[9px] font-black bg-white/5 text-white/30 hover:text-white transition-all">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <button type="button" onClick={() => setDeletingId(hackathon._id)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden divide-y divide-white/5">
                            {hackathons.map((hackathon) => (
                                <div key={hackathon._id} className="p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-white/80 line-clamp-1">{hackathon.title}</h4>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${modeColors[hackathon.mode] || modeColors.Offline}`}>
                                                    {hackathon.mode}
                                                </span>
                                                {hackathon.location && (
                                                    <span className="text-[10px] text-white/30">{hackathon.location}</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-white/20 font-mono mt-1.5">{formatRange(hackathon)}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button type="button" onClick={() => openEditForm(hackathon)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#a855f7] hover:bg-purple-500/10 transition-all" title="Edit">
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>

                                            {deletingId === hackathon._id ? (
                                                <div className="flex items-center gap-1">
                                                    <button type="button" onClick={() => handleDelete(hackathon._id)} className="px-2 py-1.5 rounded text-[9px] font-black bg-red-500/20 text-red-400">Yes</button>
                                                    <button type="button" onClick={() => setDeletingId(null)} className="px-2 py-1.5 rounded text-[9px] font-black bg-white/5 text-white/30">No</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setDeletingId(hackathon._id)} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </m.div>
        </div>
    );
}
