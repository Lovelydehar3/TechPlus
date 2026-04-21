import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../config/api';

const DarkModeContext = createContext();

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }) {
    const { user, updateUser } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Prefer DB value; fallback to system preference until user is known
        if (typeof user?.darkMode === 'boolean') {
            setIsDarkMode(user.darkMode);
            applyDarkMode(user.darkMode);
            return;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        applyDarkMode(prefersDark);
    }, [user?.darkMode]);

    const applyDarkMode = (isDark) => {
        const htmlElement = document.documentElement;
        if (isDark) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        applyDarkMode(newMode);
        try {
            const response = await userAPI.updateProfile({ darkMode: newMode });
            if (response?.success) updateUser?.(response.user);
        } catch {
            // If save fails, still keep UI mode toggled
        }
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}
