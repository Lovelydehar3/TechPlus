import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { authAPI, clearAuthToken, setAuthToken } from '../config/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX #1: Race condition guard — if a manual login/verifyOtp completes,
    // the hydrate() catch block must NOT wipe the user state.
    const loginCompleted = useRef(false);
    const hydrationAbort = useRef(null);

    const cancelHydration = useCallback(() => {
        loginCompleted.current = true;
        if (hydrationAbort.current) {
            hydrationAbort.current.abort();
            hydrationAbort.current = null;
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        hydrationAbort.current = controller;
        loginCompleted.current = false;
        let mounted = true;

        const hydrate = async () => {
            try {
                const response = await authAPI.me({ signal: controller.signal });
                if (mounted && response?.success) {
                    setUser(response.user);
                }
            } catch (err) {
                if (err?.code === 'ERR_CANCELED') return;
                // Skip wiping user if a manual login already succeeded
                if (mounted && !loginCompleted.current) {
                    setUser(null);
                    // Only clear token on explicit 401 (expired/invalid token)
                    // Don't clear on network errors (server waking up)
                    if (err?.status === 401) clearAuthToken();
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        hydrate();

        return () => {
            mounted = false;
            controller.abort();
            hydrationAbort.current = null;
        };
    }, []);

    const login = useCallback((userData, token) => {
        cancelHydration();
        if (token) setAuthToken(token);
        setUser(userData);
        setError(null);
    }, [cancelHydration]);

    const updateUser = useCallback((partialUser) => {
        setUser(prev => {
            const updated = { ...(prev || {}), ...(partialUser || {}) };
            return updated;
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch {
            /* ignore */
        } finally {
            clearAuthToken();
            setUser(null);
            setError(null);
            loginCompleted.current = false;
        }
    }, []);

    const register = useCallback(async (email, username, password, confirmPassword) => {
        try {
            setError(null);
            return await authAPI.register(email, username, password, confirmPassword);
        } catch (err) {
            const message = err?.message || 'Registration failed';
            setError(message);
            throw err;
        }
    }, []);

    const verifyOtp = useCallback(async (email, otp) => {
        try {
            setError(null);
            const response = await authAPI.verifyOtp(email, otp);

            if (response.success && response.user) {
                login(response.user, response.token);
            }

            return response;
        } catch (err) {
            const message = err?.message || 'OTP verification failed';
            setError(message);
            throw err;
        }
    }, [login]);

    const resendOtp = useCallback(async (email) => {
        try {
            setError(null);
            return await authAPI.resendOtp(email);
        } catch (err) {
            const message = err?.message || 'Failed to resend OTP';
            setError(message);
            throw err;
        }
    }, []);

    const loginWithCredentials = useCallback(async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login(email, password);

            if (response.success && response.user) {
                login(response.user, response.token);
            }

            return response;
        } catch (err) {
            const message = err?.message || 'Login failed';
            setError(message);
            throw err;
        }
    }, [login]);

    const forgotPassword = useCallback(async (email, clientOrigin) => {
        try {
            setError(null);
            return await authAPI.forgotPassword(email, clientOrigin);
        } catch (err) {
            const message = err?.message || 'Failed to send reset email';
            setError(message);
            throw err;
        }
    }, []);

    const resetPassword = useCallback(async (token, password, confirmPassword) => {
        try {
            setError(null);
            return await authAPI.resetPassword(token, password, confirmPassword);
        } catch (err) {
            const message = err?.message || 'Password reset failed';
            setError(message);
            throw err;
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            error,
            setError,
            login,
            updateUser,
            logout,
            register,
            verifyOtp,
            resendOtp,
            loginWithCredentials,
            forgotPassword,
            resetPassword
        }),
        [user, loading, error, login, updateUser, logout, register, verifyOtp, resendOtp, loginWithCredentials, forgotPassword, resetPassword]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
