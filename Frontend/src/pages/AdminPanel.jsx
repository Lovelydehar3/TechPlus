import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2 } from 'lucide-react';

export default function AdminPanel() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'admin') {
            addToast('Access denied. Admin panel is only for administrators.', 'error');
            navigate('/');
            return;
        }

        // In a real application, you would fetch users from the API
        // For now, this is a placeholder for the admin interface
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch users
            // const response = await adminAPI.getUsers();
            // setUsers(response.users);
            
            // Placeholder data
            setUsers([]);
        } catch (error) {
            addToast('Failed to fetch users', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // TODO: Implement API call to delete user
                // await adminAPI.deleteUser(userId);
                setUsers(users.filter(u => u._id !== userId));
                addToast('User deleted successfully', 'success');
            } catch (error) {
                addToast('Failed to delete user', 'error');
                console.error(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Users size={32} />
                        Admin Panel
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage users and moderation controls
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Verified Users</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.isVerified).length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Admins</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400">No users found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.isVerified 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Note</h3>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                        This is a basic admin panel interface. Additional admin endpoints can be implemented for user management, content moderation, analytics, and more.
                    </p>
                </div>
            </div>
        </div>
    );
}
