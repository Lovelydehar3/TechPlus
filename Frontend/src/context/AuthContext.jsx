import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authAPI, userAPI } from '../config/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ HYDRATE USER (IMPORTANT FIX)
    useEffect(() => {
        const hydrate = async () => {
            try {
                // 🔥 STEP 1: localStorage se user lo
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // 🔥 STEP 2: backend verify
                const response = await userAPI.getProfile();
                if (response?.success) {
                    setUser(response.user);
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
            } catch {
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };
        hydrate();
    }, []);

    // ✅ LOGIN FIX
    const login = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // 🔥 SAVE
        setError(null);
    }, []);

    const updateUser = useCallback((partialUser) => {
        setUser(prev => {
            const updated = { ...(prev || {}), ...(partialUser || {}) };
            localStorage.setItem("user", JSON.stringify(updated)); // 🔥 UPDATE STORAGE
            return updated;
        });
    }, []);

    // ✅ LOGOUT FIX
    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch {
            /* ignore */
        } finally {
            setUser(null);
            localStorage.removeItem("user"); // 🔥 CLEAR STORAGE
            setError(null);
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
                login(response.user); // 🔥 SAVE USER
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
                login(response.user); // 🔥 SAVE USER
            }

            return response;
        } catch (err) {
            const message = err?.message || 'Login failed';
            setError(message);
            throw err;
        }
    }, [login]);

    const forgotPassword = useCallback(async (email) => {
        try {
            setError(null);
            return await authAPI.forgotPassword(email);
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