import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
    if (file.size > 840 * 1024) {
      addToast('Image must be under 840KB', 'error');
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
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl my-auto border border-gray-100 bg-white">
              {/* Header */}
              <div className="p-6 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Refine Core Intel</h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!deleteConfirm ? (
                <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-5">
                  {/* Profile Photo Section */}
                  <div className="flex items-center gap-6 py-4 border-y border-gray-100">
                    <div className="relative shrink-0">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50"
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
                        <div className="absolute inset-0 rounded-2xl bg-white/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
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
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-black text-gray-700 uppercase tracking-widest transition-all cursor-pointer"
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload'}
                        </label>
                        {displayImage && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest transition-all disabled:opacity-40"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                    <input
                      type="text" name="username" value={formData.username} onChange={handleChange}
                      placeholder="Enter username"
                      className="w-full px-4 py-3 bg-[#f0f4f8] border border-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm font-semibold"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button" onClick={onClose}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-black text-gray-700 uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={loading}
                      className="flex-1 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all active:scale-95 shadow-[0_4px_20px_rgba(124,58,237,0.2)]"
                    >
                      {loading ? 'Saving...' : 'Sync Changes'}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-[10px] font-black text-red-600 uppercase tracking-widest transition-all"
                    >
                      Terminate Account
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm font-bold text-red-600 mb-1">This cannot be undone.</p>
                    <p className="text-xs text-gray-500">All your data, bookmarks, and progress will be permanently deleted.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                    <input
                      type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-[#f0f4f8] border border-red-200 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button" onClick={() => { setDeleteConfirm(false); setDeletePassword(''); }}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button" onClick={handleDeleteAccount} disabled={deleting}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-bold text-white uppercase tracking-widest transition-all"
                    >
                      {deleting ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
