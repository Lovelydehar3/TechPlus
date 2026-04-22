import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DarkModeProvider } from './context/DarkModeContext';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roadmaps = lazy(() => import('./pages/Roadmaps'));
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const Hackathons = lazy(() => import('./pages/Hackathons'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

import Layout from './components/Layout';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7c3aed]"></div>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    return <Layout>{children}</Layout>;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7c3aed]"></div>
            </div>
        );
    }
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    return <Layout>{children}</Layout>;
}

function AppContent() {
    const { user } = useAuth();
    return (
        <ErrorBoundary>
            <Suspense fallback={
                <div className="h-screen flex items-center justify-center bg-[#050505]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7c3aed]"></div>
                </div>
            }>
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
                    <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
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
