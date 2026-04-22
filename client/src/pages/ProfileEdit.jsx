import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%237c3aed' rx='16'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23ffffff40'/%3E%3Cellipse cx='40' cy='68' rx='24' ry='18' fill='%23ffffff30'/%3E%3C/svg%3E";

export default function ProfileEdit({ user, isOpen, onClose, onSuccess }) {
  const { addToast } = useToast();
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    username: user?.username || ''
  });

  const currentProfileImage = user?.profileImage || null;

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || ''
      });
    }
    setDeleteConfirm(false);
    setDeletePassword('');
    setPreviewImage(null);
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setPreviewImage(base64);
      try {
        setUploadingImage(true);
        const response = await userAPI.uploadProfileImage(base64);
        if (response.success) {
          addToast('Profile photo updated!', 'success');
          updateUser?.({ profileImage: base64 });
          onSuccess?.({ ...user, profileImage: base64 });
        }
      } catch {
        addToast('Failed to upload image', 'error');
        setPreviewImage(null);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    try {
      setUploadingImage(true);
      const response = await userAPI.uploadProfileImage('');
      if (response.success) {
        setPreviewImage(null);
        updateUser?.({ profileImage: null });
        onSuccess?.({ ...user, profileImage: null });
        addToast('Profile photo removed', 'success');
      }
    } catch {
      addToast('Failed to remove photo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || formData.username.length < 3) {
      addToast('Username must be at least 3 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.updateProfile({
        username: formData.username
      });

      if (response.success) {
        addToast('Profile updated successfully!', 'success');
        onSuccess?.(response.user);
        onClose();
      } else {
        addToast(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      const msg = error?.message || '';
      if (msg.includes('already taken')) addToast('Username is already taken', 'error');
      else addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      addToast('Enter your password to delete account', 'error');
      return;
    }
    try {
      setDeleting(true);
      await userAPI.deleteAccount(deletePassword);
      addToast('Account deleted.', 'success');
      await logout();
      navigate('/login');
    } catch (error) {
      addToast(error?.message || 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const displayImage = previewImage || currentProfileImage;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl my-auto border border-white/10 bg-[#0d0d0f]">
              {/* Header */}
              <div className="p-8 pb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Refine Core Intel</h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/30 hover:text-white transition-colors">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!deleteConfirm ? (
                <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                  {/* Profile Photo Section */}
                  <div className="flex items-center gap-6 py-4 border-y border-white/[0.03]">
                    <div className="relative shrink-0">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-[#111111]"
                      >
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#7c3aed]/10 text-[#7c3aed]">
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                        )}
                      </div>
                      {uploadingImage && (
                        <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="profile-photo-upload"
                      />
                      <div className="flex gap-2">
                        <label
                          htmlFor="profile-photo-upload"
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all cursor-pointer"
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload'}
                        </label>
                        {displayImage && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-[10px] font-black text-red-400 uppercase tracking-widest transition-all disabled:opacity-40"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Username</label>
                    <input
                      type="text" name="username" value={formData.username} onChange={handleChange}
                      placeholder="Enter username"
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:border-[#7c3aed] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button" onClick={onClose}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={loading}
                      className="flex-1 py-4 bg-[#7c3aed] hover:bg-[#8b5cf6] disabled:opacity-50 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all active:scale-95 shadow-[0_4px_20px_rgba(124,58,237,0.3)]"
                    >
                      {loading ? 'Saving...' : 'Sync Changes'}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-[10px] font-black text-red-400/40 uppercase tracking-widest transition-all"
                    >
                      Terminate Account
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm font-bold text-red-400 mb-1">This cannot be undone.</p>
                    <p className="text-xs text-white/50">All your data, bookmarks, and progress will be permanently deleted.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Confirm Password</label>
                    <input
                      type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-white/5 border border-red-500/30 rounded-lg text-white placeholder:text-white/30 focus:border-red-400 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button" onClick={() => { setDeleteConfirm(false); setDeletePassword(''); }}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button" onClick={handleDeleteAccount} disabled={deleting}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg text-sm font-bold text-white uppercase tracking-widest transition-all"
                    >
                      {deleting ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
