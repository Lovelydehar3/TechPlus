import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { hackathonAPI } from '../config/api';
import { useToast } from '../context/ToastContext';

function FormField({ label, children, required }) {
    return (
        <div>
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                {label} {required && <span className="text-purple-400">*</span>}
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
        } catch {
            addToast('Failed to delete hackathon', 'error');
        }
    };

    const formatRange = (hackathon) => {
        const start = hackathon.startDate ? new Date(hackathon.startDate).toLocaleString() : '—';
        const end = hackathon.endDate ? new Date(hackathon.endDate).toLocaleString() : '—';
        return `${start} → ${end}`;
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#a855f7] uppercase tracking-[0.3em] mb-2">
                        College Hackathons
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
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
                    New Hackathon
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass p-6 mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                {editingId ? 'Edit Hackathon' : 'Add College Hackathon'}
                            </h3>
                            <button type="button" onClick={cancelForm} className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField label="Title" required>
                                <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="input-field" maxLength={200} />
                            </FormField>

                            <FormField label="Organizer / College">
                                <input type="text" value={form.organizer} onChange={(e) => handleChange('organizer', e.target.value)} className="input-field" placeholder="Your college name" />
                            </FormField>

                            <FormField label="Mode" required>
                                <select value={form.mode} onChange={(e) => handleChange('mode', e.target.value)} className="input-field">
                                    {MODE_OPTIONS.map((mode) => (
                                        <option key={mode} value={mode} className="bg-[#111115]">{mode}</option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Location">
                                <input type="text" value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="input-field" placeholder="Campus / city" />
                            </FormField>

                            <FormField label="Start date & time" required>
                                <input type="datetime-local" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="input-field" />
                            </FormField>

                            <FormField label="End date & time" required>
                                <input type="datetime-local" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="input-field" />
                            </FormField>

                            <FormField label="Time label (optional)">
                                <input type="text" value={form.time} onChange={(e) => handleChange('time', e.target.value)} className="input-field" placeholder="e.g. 10:00 AM - 6:00 PM" />
                            </FormField>

                            <FormField label="Prize">
                                <input type="text" value={form.prize} onChange={(e) => handleChange('prize', e.target.value)} className="input-field" placeholder="e.g. ₹50,000 pool" />
                            </FormField>

                            <FormField label="Registration link">
                                <input type="url" value={form.registrationLink} onChange={(e) => handleChange('registrationLink', e.target.value)} className="input-field" placeholder="https://..." />
                            </FormField>

                            <FormField label="Banner image URL">
                                <input type="url" value={form.image} onChange={(e) => handleChange('image', e.target.value)} className="input-field" placeholder="https://..." />
                            </FormField>

                            <FormField label="Tags (comma separated)">
                                <input type="text" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="input-field" placeholder="AI, Web3" />
                            </FormField>

                            <div className="md:col-span-2">
                                <FormField label="Description">
                                    <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="input-field resize-none" maxLength={2000} />
                                </FormField>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
                            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary !w-auto px-8 !py-2.5 text-xs disabled:opacity-50">
                                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={cancelForm} className="btn-secondary !w-auto px-6 !py-2.5 text-xs">Cancel</button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            <m.div className="glass overflow-hidden">
                <div className="p-5 border-b border-white/5">
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
                    <div className="overflow-x-auto">
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
                                    <tr key={hackathon._id} className="group hover:bg-white/[0.02]">
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-bold text-white/80 line-clamp-1">{hackathon.title}</span>
                                            <span className="block text-[10px] text-white/30 mt-1">{hackathon.location || '—'}</span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-white/40">{hackathon.mode}</td>
                                        <td className="px-5 py-4 text-[10px] text-white/30 font-mono max-w-[220px]">{formatRange(hackathon)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button type="button" onClick={() => openEditForm(hackathon)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-[#a855f7]">Edit</button>
                                                {deletingId === hackathon._id ? (
                                                    <>
                                                        <button type="button" onClick={() => handleDelete(hackathon._id)} className="px-2 py-1 text-[9px] font-black bg-red-500/20 text-red-400 rounded">Confirm</button>
                                                        <button type="button" onClick={() => setDeletingId(null)} className="px-2 py-1 text-[9px] font-black bg-white/5 text-white/30 rounded">Cancel</button>
                                                    </>
                                                ) : (
                                                    <button type="button" onClick={() => setDeletingId(hackathon._id)} className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-red-400">Delete</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </m.div>
        </div>
    );
}
