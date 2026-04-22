import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetail from './pages/RoadmapDetail';
import Resources from './pages/Resources';
import Hackathons from './pages/Hackathons';
import About from './pages/About';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import PasswordReset from './pages/PasswordReset';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7c3aed]"></div>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    return <Layout>{children}</Layout>;
}

function AppContent() {
    const { user } = useAuth();
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/roadmaps" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
                <Route path="/roadmaps/:id" element={<ProtectedRoute><RoadmapDetail /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/hackathons" element={<ProtectedRoute><Hackathons /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toast />
        </ErrorBoundary>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <DarkModeProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </DarkModeProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
